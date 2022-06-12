import dayjs from "dayjs";
import { getRepository } from "typeorm";
import platformLinks from "../../configs/platform-links.config";
import { HttpException } from "../../helpers/errors/http.exception";
import {
  NewSendMailOptions,
  sendBulkMail,
  sendSingleMail,
} from "../../helpers/nodemailer";
import { Election } from "../election/entity/election.entity";
import { finalStatusSubquery } from "../launchpad/launchpad.helper";
import { Voter } from "../voter/entity/voter.entity";
import { voterPinParser } from "../voter/voter.helper";
import mailerHelper, { emailTemplates } from "./mailer.helper";
import {
  AdminLoginOTPTemplate,
  ElectionHasEndedTemplate,
  ElectionHasLaunchedTemplate,
  ElectionWillStartTemplate,
  PregistrationApprovedTemplate,
  ThankYouForVotingContextTemplate,
  VoterCredentialsContextTemplate,
} from "./mailer.interface";

const sendVotersCredentialsEmail = async (
  _election_id: number,
  _voters_ids: number[] | "all"
) => {
  const electionRepository = getRepository(Election);
  const voterRepository = getRepository(Voter);

  if (_voters_ids !== "all" && !_voters_ids.length) {
    throw new HttpException(
      "NOT_FOUND",
      "You must select some voter ID's or set voter_ids to 'all' to send email to all voters"
    );
  }

  console.log("Election ID", _election_id);

  let electionBuilder = electionRepository.createQueryBuilder("election");

  electionBuilder = electionBuilder
    .addSelect(finalStatusSubquery(electionBuilder.alias))
    .where("election.id = :_election_id", {
      _election_id,
    });

  const election = await electionBuilder.getOne();

  console.log(election);

  if (!election) throw new HttpException("NOT_FOUND", "Election not found");

  let voterBuilder = voterRepository.createQueryBuilder("voter");

  voterBuilder = voterBuilder.where(
    "voter.election_id = :_election_id AND voter.disabled = :disabled",
    {
      _election_id,
      disabled: false,
    }
  );

  if (_voters_ids !== "all") {
    if (!_voters_ids.length)
      throw new HttpException("BAD_REQUEST", "No voters selected");

    voterBuilder = voterBuilder.andWhereInIds(_voters_ids);
  }

  voterBuilder = voterBuilder
    .leftJoinAndSelect("voter.election", "election")
    .select([
      "voter.firstname",
      "voter.lastname",
      "voter.id",
      "voter.email_address",
      "voter.username",
      "voter.pin",
      "election.id",
      "election.start_date",
      "election.close_date",
      "election.slug",
      "election.title",
    ]);

  const voters = await voterBuilder.getMany();

  if (!voters.length) throw new HttpException("BAD_REQUEST", "No voters found");

  const messages: NewSendMailOptions<VoterCredentialsContextTemplate>[] =
    voters.map((item) => ({
      ...emailTemplates.voterCredentails,
      to: item.email_address,
      context: {
        firstname: item.firstname,
        lastname: item.lastname,
        election_date: mailerHelper.formatDateTime(item.election.start_date),
        election_link: platformLinks.voting(item.election.slug),
        voterId: item.username,
        pin: voterPinParser(item.pin),
        title: emailTemplates.voterCredentails.title.replace(
          "$electionTitle",
          item.election.title
        ),
      },
    }));

  sendBulkMail(messages);

  return messages;
};

const mailVotersCredentialsEmail = async (elections: Election[]) => {
  const messages: NewSendMailOptions<VoterCredentialsContextTemplate>[] = [];

  elections.forEach((election) => {
    election.voters.forEach((voter) => {
      messages.push({
        ...emailTemplates.voterCredentails,
        to: voter.email_address,
        context: {
          firstname: voter.firstname,
          lastname: voter.lastname,
          election_date: mailerHelper.formatDateTime(election.start_date),
          election_link: platformLinks.voting(election.slug),
          voterId: voter.username,
          pin: voterPinParser(voter.pin),
          title: emailTemplates.voterCredentails.title.replace(
            "$electionTitle",
            election.title
          ),
        },
      });
    });
  });

  sendBulkMail(messages);
};

const sendThankYouForVotingEmail = async (voter: Voter, election: Election) => {
  const message: NewSendMailOptions<ThankYouForVotingContextTemplate> = {
    ...emailTemplates.thankYouForVoting,
    to: voter.email_address,
    context: {
      firstname: voter.firstname,
      lastname: voter.lastname,
      title: emailTemplates.thankYouForVoting.title.replace(
        "$electionTitle",
        election.title
      ),
      election_title: election.title,
      election_end_date: mailerHelper.formatDateTime(election.close_date),
      election_result_link: platformLinks.election(election.slug),
    },
  };

  sendSingleMail(message);

  return true;
};

const sendElectionHasLaunched = async (_election_ids: number[]) => {
  const voterRepository = getRepository(Voter);

  let voterBuilder = voterRepository.createQueryBuilder("voter");

  voterBuilder = voterBuilder
    .leftJoinAndSelect("voter.election", "election")
    .select(finalStatusSubquery("election"))
    .addSelect([
      "voter.firstname",
      "voter.lastname",
      "voter.disabled",
      "voter.email_address",
      "voter.disabled",
      "voter.is_pre_register",
      "election.id",
      "election.start_date",
      "election.close_date",
      "election.slug",
      "election.title",
      "election.final_status",
    ]);

  voterBuilder = voterBuilder
    // .where("election.final_status = :final_status", {
    //   final_status: "running",
    // })
    .andWhere(
      "voter.election_id IN(:..._election_ids) AND voter.disabled = :disabled",
      {
        _election_ids: _election_ids,
        disabled: false,
        is_pre_register: false,
        // voters_ids: [32, 24, 6], // remove this
      }
    );

  const voters = await voterBuilder.getMany();

  if (!voters.length)
    throw new HttpException("BAD_REQUEST", "No voters are avaialable");

  const messages: NewSendMailOptions<ElectionHasLaunchedTemplate>[] =
    voters.map((item) => ({
      ...emailTemplates.electionHasLaunched,
      to: item.email_address,
      context: {
        election_end_date: mailerHelper
          .formatDateTime(item.election.close_date)
          .toString(),
        election_start_date: mailerHelper
          .formatDateTime(item.election.start_date)
          .toString(),
        election_title: item.election.title,
        title: emailTemplates.electionHasLaunched.title.replace(
          "$electionTitle",
          item.election.title
        ),
      },
    }));

  sendBulkMail(messages);

  return true;
};

const mailElectionWillStart = async (elections: Election[]) => {
  const messages: NewSendMailOptions<ElectionWillStartTemplate>[] = [];

  console.log(elections);

  elections.forEach((election) => {
    election.voters.forEach((voter) => {
      messages.push({
        ...emailTemplates.electionWillStart,
        to: voter.email_address,
        context: {
          election_end_date: mailerHelper
            .formatDateTime(election.close_date)
            .toString(),
          election_start_date: mailerHelper
            .formatDateTime(election.start_date)
            .toString(),
          election_title: election.title,
          title: emailTemplates.electionWillStart.title(election.title),
          election_link: platformLinks.election(election.slug),
          election_vote_link: platformLinks.voting(election.slug),
          firstname: voter.firstname,
          lastname: voter.lastname,
          is_public: election.is_public,
        },
      });
    });
  });

  console.log(messages);

  sendBulkMail(messages);
};

const sendElectionHasEnded = async (_election_id: Election["id"]) => {
  const electionRepository = getRepository(Election);
  let electionBuilder = electionRepository.createQueryBuilder("election");

  electionBuilder = electionBuilder
    .leftJoinAndSelect("election.voters", "voters")
    .select(finalStatusSubquery("election"))
    .addSelect([
      "voters.firstname",
      "voters.lastname",
      "voters.disabled",
      "voters.is_pre_register",
      "voters.email_address",
      "election.id",
      "election.start_date",
      "election.close_date",
      "election.slug",
      "election.title",
      "election.final_status",
    ])
    .where(
      `election.id = :election_id 
        AND voters.disabled = :disabled 
        AND voters.is_pre_register = :pre_registered
      `,
      {
        election_id: _election_id,
        disabled: false,
        pre_registered: false,
      }
    );

  const election = await electionBuilder.getOne();
  const voters = election.voters;

  console.log(election);

  if (!voters.length)
    throw new HttpException("BAD_REQUEST", "No voters are avaialable");

  const messages: NewSendMailOptions<ElectionHasEndedTemplate>[] = voters.map(
    (item) => ({
      ...emailTemplates.electionHasEnded,
      to: item.email_address,
      context: {
        election_end_date: mailerHelper
          .formatDateTime(election.close_date)
          .toString(),
        election_title: election.title,
        title: emailTemplates.electionHasEnded.title.replace(
          "$electionTitle",
          election.title
        ),
        election_result_link: platformLinks.election(election.slug),
      },
    })
  );

  sendBulkMail(messages);

  return true;
};

const mailElectionHasEnded = async (elections: Election[]) => {
  const messages: NewSendMailOptions<ElectionHasEndedTemplate>[] = [];

  elections.forEach((election) => {
    election.voters.forEach((voter) => {
      messages.push({
        ...emailTemplates.electionHasEnded,
        to: voter.email_address,
        context: {
          election_end_date: mailerHelper
            .formatDateTime(election.close_date)
            .toString(),
          election_title: election.title,
          title: emailTemplates.electionHasEnded.title.replace(
            "$electionTitle",
            election.title
          ),
          election_result_link: platformLinks.election(election.slug),
        },
      });
    });
  });

  sendBulkMail(messages);
};

const sendAdminLoginOTP = async (data: AdminLoginOTPTemplate) => {
  const message: NewSendMailOptions<AdminLoginOTPTemplate> = {
    ...emailTemplates.sendAdminLoginOTP,
    to: data.email_address,
    context: {
      firstname: data.firstname,
      lastname: data.lastname,
      login_otp: data.login_otp,
      email_address: data.email_address,
    },
  };
  console.log(message);

  sendSingleMail(message);

  return message;
};

const sendPreRegisterApproved = async (
  data: PregistrationApprovedTemplate[]
) => {
  const messages: NewSendMailOptions<PregistrationApprovedTemplate>[] =
    data.map((item) => ({
      ...emailTemplates.preRegisterApproved,
      to: item.email_address,
      context: {
        email_address: item.email_address,
        title: emailTemplates.preRegisterApproved.title(item.title),
        firstname: item.firstname,
        lastname: item.lastname,
        election_title: item.title,
      },
    }));

  sendBulkMail(messages);

  return messages;
};

const mailerServices = {
  sendVotersCredentialsEmail,
  sendThankYouForVotingEmail,
  sendElectionHasLaunched,
  sendElectionHasEnded,
  sendAdminLoginOTP,
  sendPreRegisterApproved,
  mailElectionWillStart,
  mailVotersCredentialsEmail,
  mailElectionHasEnded,
};

export default mailerServices;
