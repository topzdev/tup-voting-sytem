import { getRepository } from "typeorm";
import { ElectionLogo } from "../../modules/election/entity/election-logo.entity";
import { Election } from "../../modules/election/entity/election.entity";
import { ElectionMails } from "../../modules/mailer/entity/election-mails.entity";
import mailerServices from "../../modules/mailer/mailer.service";
import { Voter } from "../../modules/voter/entity/voter.entity";

const sendElectionWillStartHandler = async () => {
  try {
    console.log("Send Election Will Start Emaill");
    console.log("mail cron job started");
    // fetch elections that will start tomorrow and not already sent
    const electionBuilder =
      getRepository(Election).createQueryBuilder("election");

    console.log("querying elections");
    const elections = await electionBuilder
      .leftJoinAndSelect("election.voters", "voters")
      .leftJoinAndSelect("election.election_mails", "election_mails")
      .where(
        `
				(election.start_date >= NOW() 
					AND 
				election.start_date < (NOW() + INTERVAL '2 DAY')) 
					AND 
				election_mails.election_will_start_sent IS NULL
			`
      )
      .getMany();

    if (!elections.length) return;

    // call mailer service to send the emails
    console.log("sending emails");
    mailerServices.mailElectionWillStart(elections);

    console.log("saving records");
    // if no errors, save dates of election started datetime

    await elections.forEach(async (item) => {
      // if election_mails is null, then create one;

      let toUpdateElectionMails = item.election_mails;

      if (!item.election_mails) {
        toUpdateElectionMails = ElectionMails.create({
          election_id: item.id,
          election_will_start_sent: new Date(),
        });

        await toUpdateElectionMails.save();
      } else {
        toUpdateElectionMails.election_will_start_sent = new Date();
      }

      const toUpdateElection = Election.merge(item, {
        election_mails: toUpdateElectionMails,
      });

      await toUpdateElection.save();
      await toUpdateElectionMails.save();
    });
    console.log("mail cron job ended");
  } catch (error) {
    // check if email has errors
    throw Error('Error on mailer "Election will start" mail');
  }
};

const sendElectionCredentialsHandler = async () => {
  try {
    console.log("Send Email Credentials");
    console.log("mail cron job started");
    // fetch elections that will start tomorrow and not already sent
    const electionBuilder =
      getRepository(Election).createQueryBuilder("election");

    console.log("querying elections");
    const elections = await electionBuilder
      .leftJoinAndSelect("election.voters", "voters")
      .leftJoinAndSelect("election.election_mails", "election_mails")
      .where(
        `
				(election.start_date >= NOW() 
					AND 
				election.start_date < (NOW() + INTERVAL '1 DAY')) 
					AND 
				election_mails.credentials_email_sent IS NULL
			`
      )
      .getMany();

    if (!elections.length) return;

    // call mailer service to send the emails
    console.log("sending emails");
    mailerServices.mailVotersCredentialsEmail(elections);

    console.log("saving records");
    // if no errors, save dates of election started datetime

    await elections.forEach(async (item) => {
      // if election_mails is null, then create one;

      let toUpdateElectionMails = item.election_mails;

      if (!item.election_mails) {
        toUpdateElectionMails = ElectionMails.create({
          election_id: item.id,
          credentials_email_sent: new Date(),
        });

        await toUpdateElectionMails.save();
      } else {
        toUpdateElectionMails.credentials_email_sent = new Date();
      }

      const toUpdateElection = Election.merge(item, {
        election_mails: toUpdateElectionMails,
      });

      await toUpdateElection.save();
      await toUpdateElectionMails.save();
    });
    console.log("mail cron job ended");
  } catch (error) {
    // check if email has errors
    throw Error('Error on mailer "Election will start" mail');
  }
};

const sendElectionHasEnded = async () => {
  try {
    console.log("Send Election has ended Emaill");
    console.log("mail cron job started");
    // fetch elections that will start tomorrow and not already sent
    const electionBuilder =
      getRepository(Election).createQueryBuilder("election");

    console.log("querying elections");
    const elections = await electionBuilder
      .leftJoinAndSelect("election.voters", "voters")
      .leftJoinAndSelect("election.election_mails", "election_mails")
      .where(
        `
      WHERE 
        (election.close_date > CURRENT_TIMESTAMP - INTERVAL '1 day' AND election.close_date < CURRENT_TIMESTAMP) 
      AND 
        (election.status >= '3' OR CURRENT_TIMESTAMP >= election.close_date) 
      AND 
        election_mails.election_ended_email_sent IS NULL
				`
      )
      .getMany();

    if (!elections.length) return;

    // call mailer service to send the emails
    console.log("sending emails");
    mailerServices.mailElectionHasEnded(elections);

    console.log("saving records");
    // if no errors, save dates of election started datetime

    await elections.forEach(async (item) => {
      // if election_mails is null, then create one;

      let toUpdateElectionMails = item.election_mails;

      if (!item.election_mails) {
        toUpdateElectionMails = ElectionMails.create({
          election_id: item.id,
          election_ended_email_sent: new Date(),
        });

        await toUpdateElectionMails.save();
      } else {
        toUpdateElectionMails.election_ended_email_sent = new Date();
      }

      const toUpdateElection = Election.merge(item, {
        election_mails: toUpdateElectionMails,
      });

      await toUpdateElection.save();
      await toUpdateElectionMails.save();
    });
    console.log("mail cron job ended");
  } catch (error) {
    // check if email has errors
    throw Error('Error on mailer "Election will start" mail');
  }
};

const cronHandlers = {
  sendElectionWillStartHandler,
  sendElectionCredentialsHandler,
  sendElectionHasEnded,
};

export default cronHandlers;
