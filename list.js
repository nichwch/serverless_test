import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userid = :userid': only return items with matching 'userid'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userid': defines 'userid' to be Identity Pool identity id
    //   of the authenticated user
    KeyConditionExpression: "userid = :userid",
    ExpressionAttributeValues: {
      ":userid": event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}