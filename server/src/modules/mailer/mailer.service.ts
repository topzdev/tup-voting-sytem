import { getRepository, In } from "typeorm";
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
import { emailTemplates } from "./mailer.helper";
import {
  ElectionHasEndedTemplate,
  ElectionHasLaunchedTemplate,
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
    "voter.election_id = :_election_id AND voter.is_allowed = :is_allowed",
    {
      _election_id,
      is_allowed: true,
    }
  );

  if (_voters_ids !== "all") {
    voterBuilder = voterBuilder.andWhereInIds(_voters_ids);
  }

  voterBuilder = voterBuilder
    .leftJoinAndSelect("voter.election", "election")
    .select([
      "voter.firstname",
      "voter.lastname",
      "voter.id",
      "voter.is_allowed",
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

  if (!voters.length)
    throw new HttpException("BAD_REQUEST", "No voters selected");

  const messages: NewSendMailOptions<VoterCredentialsContextTemplate>[] =
    voters.map((item) => ({
      ...emailTemplates.voterCredentails,
      to: item.email_address,
      context: {
        firstname: item.firstname,
        lastname: item.lastname,
        election_date: new Date(item.election.start_date).toString(),
        election_link: platformLinks.voting.replace(
          "$electionSlug",
          item.election.slug
        ),
        voterId: item.username,
        pin: item.pin,
        title: emailTemplates.voterCredentails.title.replace(
          "$electionTitle",
          item.election.title
        ),
      },
    }));

  sendBulkMail(messages);

  return messages;
};

const sendThankYouForVotingEmail = async (_voter_id: number) => {
  const voterRepository = getRepository(Voter);

  let voterBuilder = voterRepository.createQueryBuilder("voter");

  voterBuilder = voterBuilder
    .leftJoinAndSelect("voter.election", "election")
    .leftJoinAndSelect("voter.voted", "voted")
    .where("voter.id = :_voter_id", {
      _voter_id,
    });

  const voter = await voterBuilder.getOne();

  if (!voter) throw new HttpException("NOT_FOUND", "Voter not found");

  if (voter.voted) throw new HttpException("NOT_FOUND", "Voter not yet voted");

  const message: NewSendMailOptions<ThankYouForVotingContextTemplate> = {
    ...emailTemplates.thankYouForVoting,
    to: voter.email_address,
    context: {
      firstname: voter.firstname,
      lastname: voter.lastname,
      title: emailTemplates.thankYouForVoting.title.replace(
        "$electionTitle",
        voter.election.title
      ),
      election_title: voter.election.title,
      election_end_date: new Date(voter.election.close_date).toString(),
      election_result_link: platformLinks.election.replace(
        "$electionSlug",
        voter.election.slug
      ),
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
      "voter.is_allowed",
      "voter.email_address",
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
      "voter.election_id IN(:..._election_ids) AND voter.is_allowed = :is_allowed",
      {
        _election_ids: _election_ids,
        is_allowed: true,
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
        election_end_date: new Date(item.election.close_date).toString(),
        election_start_date: new Date(item.election.start_date).toString(),
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

const sendElectionHasEnded = async (_election_ids: number[]) => {
  const voterRepository = getRepository(Voter);

  let voterBuilder = voterRepository.createQueryBuilder("voter");

  voterBuilder = voterBuilder
    .leftJoinAndSelect("voter.election", "election")
    .select(finalStatusSubquery("election"))
    .addSelect([
      "voter.firstname",
      "voter.lastname",
      "voter.is_allowed",
      "voter.email_address",
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
    .where(
      "voter.election_id IN(:..._election_ids) AND voter.is_allowed = :is_allowed ",
      {
        _election_ids: _election_ids,
        is_allowed: true,
      }
    )
    .andWhere("voter.id IN(:...voters_ids)", {
      voters_ids: [32, 24, 6], // remove this
    });

  const voters = await voterBuilder.getMany();

  if (!voters.length)
    throw new HttpException("BAD_REQUEST", "No voters are avaialable");

  const messages: NewSendMailOptions<ElectionHasEndedTemplate>[] = voters.map(
    (item) => ({
      ...emailTemplates.electionHasEnded,
      to: item.email_address,
      context: {
        election_end_date: new Date(item.election.close_date).toString(),
        election_title: item.election.title,
        title: emailTemplates.electionHasEnded.title.replace(
          "$electionTitle",
          item.election.title
        ),
        election_result_link: platformLinks.election.replace(
          "$electionSlug",
          item.election.slug
        ),
      },
    })
  );

  sendBulkMail(messages);

  return true;
};

const mailerServices = {
  sendVotersCredentialsEmail,
  sendThankYouForVotingEmail,
  sendElectionHasLaunched,
  sendElectionHasEnded,
};

export default mailerServices;
