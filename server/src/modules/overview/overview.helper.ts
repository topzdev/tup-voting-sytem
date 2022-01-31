import {
    LaunchpadValidation,
    LaunchpadValidationData,
  } from "./overview.interface";
  
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
    | "no-slug-edit";
  
  export const validationMessages: Record<ValidationIds, LaunchpadValidation> = {
    ["no-voters"]: {
      severity: "error",
      title: "No Voters Registered",
      message: "voters is essential in an election",
    },
    ["no-parties"]: {
      severity: "warning",
      title: "No party added in this election",
      message: "Np party test test test",
    },
    ["no-positions"]: {
      severity: "error",
      title: "No positions added in this election",
      message: "No positi9ons test test test",
    },
    ["no-candidates"]: {
      severity: "error",
      title: "No candidates added in this election",
      message: "No candidates test test test",
    },
    ["position-no-candidates"]: {
      severity: "warning",
      title: "Some of election positions has no candidates ",
      message: "Hello WOrld Posiution must have Candidates",
    },
    ["start-date-behind"]: {
      severity: "warning",
      title: "Election start date is behind the current date",
      message: "Please adjust your ",
    },
    ["close-date-behind"]: {
      severity: "error",
      title: "Election closing date is behind the current date",
      message:
        "We cannot launch an election that closing date is left behind by the current data please update your closing date to adviekjwlej ",
    },
    ["insufficient-candidates"]: {
      severity: "error",
      title: "Insufficient candidates for position minimum vote selection.",
      message:
        "These positions (n1, n2, n3) required a specific minimum vote selection but the candidates’ option is insufficient. ",
    },
    ["candidates-no-position"]: {
      severity: "warning",
      title: "Candidates no position assigned.",
      message: "These candidates (n1, n2, n3) has no position assigned.",
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
  
    /* check if election close_date is behind the current date, sample yung closing date is january 14 january tas date ngayun is january 15 edi tapos na election??? bat mo pa ilalaunch hahahah */
    if (new Date(start_date).getTime() <= new Date().getTime()) {
      validations.push(validationMessages["start-date-behind"]);
    }
  
    /* check if election start_date is less than the current date, sample is start_date na sinet mo is january 12 tas current date ngayun is january 15 edi yung 3 days late na yung election haha */
    if (new Date(close_date).getTime() <= new Date().getTime()) {
      validations.push(validationMessages["close-date-behind"]);
    }
  
    /* may candidates dapat bawat position na nilagay pre, pag kasi walang candidates yung position hindi natin iyun isasama sa ballot, so kung gusto nila mag appear yung positio na yun dapat may candidates sila na inaassign dun. */
    const positonNoCandidates = positions.filter(
      (item) => item.candidatesCount <= 0
    );
    if (positonNoCandidates.length) {
      validations.push({
        ...validationMessages["position-no-candidates"],
        message: `This list of position (${positonNoCandidates
          .map((item) => item.title)
          .join(",")}) has no candidates available`,
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
          )}) required a specific minimum vote selection but the candidates’ option is insufficient. `,
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
  
    validations.push(validationMessages["no-slug-edit"]);
  
    return validations;
  };
  
  const STATUS_MESSAGE = {
    1: "building",
    2: "running",
    3: "completed",
    4: "archived",
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
      RUNNING = 2,
      COMPLETED = 3,
    ARCHIVED = 4,
  */
  
  export const finalStatusSubquery = (alias) => {
    return `
     CASE	
        WHEN "election"."status" > '3' OR "election"."archive" = TRUE 					
                  THEN '${STATUS_MESSAGE[4]}' 
          
        WHEN "election"."status" > '2' OR CURRENT_TIMESTAMP >= "election"."close_date"  
            THEN '${STATUS_MESSAGE[3]}'
  
        WHEN "election"."status" > '1' 													
                  THEN '${STATUS_MESSAGE[2]}'
    
        ELSE '${STATUS_MESSAGE[1]}'
      
      END AS ${alias}_final_status
    `;
  };
  