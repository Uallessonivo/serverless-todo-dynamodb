import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamoDB";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_todos",
      IndexName: "user_id_index",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  const { Items: userTodos } = response;

  if (userTodos.length === 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User doesn't exists",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(userTodos),
  };
};
