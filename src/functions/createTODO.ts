import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamoDB";
import { v4 as uuid } from "uuid";

interface IRequest {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as IRequest;

  const todo = {
    id: uuid(),
    title,
    user_id,
    done: false,
    deadline: new Date(deadline).toISOString(),
  };

  await document
    .put({
      TableName: "users_todos",
      Item: todo,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(todo),
  };
};
