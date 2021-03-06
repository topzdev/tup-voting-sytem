import {
  LaunchpadValidation,
  LaunchpadValidationData,
} from "./launchpad.interface";

export const ifEmptyStringReturnNull = (value: any) => {
  return value === "" ? null : value;
};

type ValidationIds =
  | "no-voters"
  | "no-parties"
  | "no-positions"
  | "no-candidates"
  | "position-no-candidates"
  | "start-date-behind"
  | "close-date-behind"
  | "insufficient-candidates"
  | "candidates-no-position"
  | "no-slug-edit"
  | "preview-mode";

export const validationMessages: Record<ValidationIds, LaunchpadValidation> = {
  ["no-voters"]: {
    severity: "error",
    title: "No voters added in this election",
    message: "Add at least 3 voters in able to launch the election",
  },
  ["no-parties"]: {
    severity: "warning",
    title: "No party added in this election",
    message:
      "There is no Party added in this Election. (All candidates without Party will be labeled as “Independent”)",
  },
  ["no-positions"]: {
    severity: "error",
    title: "No positions added in this election",
    message:
      "There is no Position added in this Election. Add at least 1 in able to launch the Election.",
  },
  ["no-candidates"]: {
    severity: "error",
    title: "No candidates added in this election",
    message: "No candidates test test test",
  },
  ["position-no-candidates"]: {
    severity: "warning",
    title: "Some of election positions has no candidates ",
    message: "There is no Candidate added in this Position(s)",
  },
  ["start-date-behind"]: {
    severity: "warning",
    title: "Election start date is behind the current date",
    message: "Warning: Your Election starting date is behind the Current date.",
  },
  ["close-date-behind"]: {
    severity: "error",
    title: "Election closing date is behind the current date",
    message:
      "Cannot launch the Election. Please check if your Closing Date is ahead the Current date.",
  },
  ["insufficient-candidates"]: {
    severity: "error",
    title: "Insufficient candidates for position minimum vote selection.",
    message:
      "These positions (n1, n2, n3) required a specific minimum vote selection but the candidates’ option is insufficient.",
  },
  ["candidates-no-position"]: {
    severity: "warning",
    title: "Candidates no position assigned",
    message: "These candidates (n1, n2, n3) has no position assigned",
  },
  ["preview-mode"]: {
    severity: "info",
    title: "Election will be in preview mode",
    message:
      'The election will be on "Preview Mode" if the current date is behind the election start date. The election will be on "Running Phase" if it reach the election start date. In the "Running Phase", only the voter can start voting.',
  },
  ["no-slug-edit"]: {
    severity: "info",
    title: "The slug cannot be changed after launched",
    message: "The election slug cannot be changed after the building phase",
  },
};

type ValidateMessagesIds = keyof typeof validationMessages;

export const launchpadValidationChecker = (data: LaunchpadValidationData) => {
  const {
    votersCount,
    partiesCount,
    positionsCount,
    candidatesCount,
    start_date,
    close_date,
    positions,
    candidates,
  } = data;
  let currentDate = new Date().getTime();
  let validations: LaunchpadValidation[] = [];

  /* dapat may voters na nakaadd bago mag launch, sino boboto sa election kung wala naman naka add diba? haha */
  if (votersCount <= 0) {
    validations.push(validationMessages["no-voters"]);
  }

  /* kailangan may party - di naman required na may party nakaadd kasi pwede naman iset as independent party yung mga candidates, */
  if (partiesCount <= 0) {
    validations.push(validationMessages["no-parties"]);
  }

  /* Position is required, kung walang position kasi di ka makakapag add ng candidates */
  if (positionsCount <= 0) {
    validations.push(validationMessages["no-positions"]);
  }

  /* Required dapat na may candidates na naka add */
  if (candidatesCount <= 0) {
    validations.push(validationMessages["no-candidates"]);
  }

  /* Since the election will launch behind the start date the election will automatically in preview mode */
  if (currentDate < new Date(start_date).getTime()) {
    validations.push(validationMessages["preview-mode"]);
  }

  /* check if election close_date is behind the current date, sample yung closing date is january 14 january tas date ngayun is january 15 edi tapos na election??? bat mo pa ilalaunch hahahah */
  if (new Date(start_date).getTime() <= currentDate) {
    validations.push(validationMessages["start-date-behind"]);
  }

  /* check if election start_date is less than the current date, sample is start_date na sinet mo is january 12 tas current date ngayun is january 15 edi yung 3 days late na yung election haha */
  if (new Date(close_date).getTime() <= currentDate) {
    validations.push(validationMessages["close-date-behind"]);
  }

  /* may candidates dapat bawat position na nilagay pre, pag kasi walang candidates yung position hindi natin iyun isasama sa ballot, so kung gusto nila mag appear yung positio na yun dapat may candidates sila na inaassign dun. */
  const positonNoCandidates = positions.filter(
    (item) => item.candidatesCount <= 0
  );
  if (positonNoCandidates.length) {
    validations.push({
      ...validationMessages["position-no-candidates"],
      message: `There is no Candidate added in this Position(s) (${positonNoCandidates
        .map((item) => item.title)
        .join(",")})`,
    });
  }

  /* set a minimum vote each position but the candiddates count is less than the minimum */
  const positionInsufficientCandidates = positions.filter(
    (item) => item.min_selected > item.candidatesCount
  );
  if (positionInsufficientCandidates.length) {
    validations.push({
      ...validationMessages["insufficient-candidates"],
      message: `These positions (${positionInsufficientCandidates
        .map((item) => item.title)
        .join(
          ","
        )}) required a specific minimum vote selection but the candidates’ option is insufficient `,
    });
  }

  const candidatesNoPosition = candidates.filter((item) => !item.position);
  if (candidatesNoPosition.length) {
    validations.push({
      ...validationMessages["candidates-no-position"],
      message: `These candidates (${candidatesNoPosition
        .map((item) => `${item.firstname} ${item.lastname}`)
        .join(",")}) has no position assigned. `,
    });
  }

  return validations;
};

const STATUS_MESSAGE = {
  1: "building",
  2: "preview",
  3: "running",
  4: "completed",
  5: "archived",
};

export const statusAsTextSubquery = () => {
  return `
  CASE 
		WHEN "election"."status" = '1' THEN '${STATUS_MESSAGE[1]}'
		WHEN "election"."status" = '2' THEN '${STATUS_MESSAGE[2]}'
		WHEN "election"."status" = '3' THEN '${STATUS_MESSAGE[3]}'
		WHEN "election"."status" = '4' THEN '${STATUS_MESSAGE[4]}'
	END;
  `;
};

/**
  CASE	

      #######
      When status COMPLETED and ELection is ARCHIVED then set ARCHIVED 
      #######

      WHEN status >= '3' AND "election"."archive" = TRUE 					
			  THEN 'archived' 
		
			#########
      When status COMPLETED and THE CLOSING DATE IS GREATHER THAN CURRENT DATE-TIME then set COMPLETED
      
			- then election must be in running status and in closing date to be COMPLETED.
			- if election is running and election is close then its COMPLETED.
			- if election is completed it is COMPLETED```
      ##########

      WHEN status >= '2' AND CURRENT_TIMESTAMP >= "election"."close_date"  
			  THEN 'compeleted'

      ###########
			When status more thant building and in running stauts set RUNNING
      ###########

      WHEN status > '1' 													
			  THEN 'running'
      
      ELSE 'building'
      
    END
 * */

/*  
	BUILDING = 1,
  PREVIEW = 2 but when election is not yet on start date
	RUNNING = 3,
	COMPLETED = 4,
  ARCHIVED = 5,
*/

export const finalStatusSubquery = (alias) => {
  return `
   CASE	
      /*THE ELECTION IS IN ARCHIVE STATUS*/
      WHEN "election"."status" > '4' OR "election"."archive" = TRUE 					
			    THEN '${STATUS_MESSAGE[5]}' 

      /*THE ELECTION IS IN COMPLETED STATUS*/  
      WHEN "election"."status" >= '3' OR CURRENT_TIMESTAMP >= "election"."close_date"  
          THEN '${STATUS_MESSAGE[4]}'

      /*THE ELECTION IS RUNNING STATUS*/ 
      WHEN "election"."status" > '1' AND CURRENT_TIMESTAMP >= "election"."start_date"
          THEN '${STATUS_MESSAGE[3]}'

      /*THE ELECTION IS IN PREVIEW STATE*/
      WHEN "election"."status" > '1' AND CURRENT_TIMESTAMP < "election"."start_date"													
			    THEN '${STATUS_MESSAGE[2]}'
  
      ELSE '${STATUS_MESSAGE[1]}'
    
    END AS ${alias}_final_status
  `;
};
