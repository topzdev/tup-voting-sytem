export const ifEmptyStringReturnNull = (value: any) => {
  return value === "" ? null : value;
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
      WHEN "election"."status" >= '3' AND "election"."archive" = TRUE 					
			    THEN '${STATUS_MESSAGE[4]}' 
		
      WHEN "election"."status" >= '2' AND CURRENT_TIMESTAMP >= "election"."close_date"  
          THEN '${STATUS_MESSAGE[3]}'

      WHEN "election"."status" > '1' 													
			    THEN '${STATUS_MESSAGE[2]}'
  
      ELSE '${STATUS_MESSAGE[1]}'
    
    END AS ${alias}_final_status
  `;
};
