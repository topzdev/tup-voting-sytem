import { getRepository } from "typeorm";
import { Election } from "../../modules/election/entity/election.entity";
import { ElectionMails } from "../../modules/mailer/entity/election-mails.entity";
import mailerServices from "../../modules/mailer/mailer.service";
import { Voter } from "../../modules/voter/entity/voter.entity";

const sendElectionWillStartHandler = async () => {
  try {
    console.log("mail cron job started");
    // fetch elections that will start tomorrow and not already sent
    const electionBuilder =
      getRepository(Election).createQueryBuilder("election");

    console.log("querying elections");
    const elections = await electionBuilder
      .leftJoinAndSelect("election.voters", "voters")
      .leftJoin("election.election_mails", "election_mails")
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
    elections.forEach(async (item) => {
      // if election_mails is null, then create one;
      if (!item.election_mails) {
        item.election_mails = ElectionMails.create({
          election_id: item.id,
          election_will_start_sent: new Date(),
        });
      } else {
        item.election_mails.election_will_start_sent = new Date();
      }
      await item.save();
    });
  } catch (error) {
    // check if email has errors
    throw Error('Error on mailer "Election will start" mail');
  } finally {
    console.log("mail cron job ended");
  }
};

const cronHandlers = {
  sendElectionWillStartHandler,
};

export default cronHandlers;
