require("dotenv").config();

export async function start(event, context) {
  console.log("fala ai 2")
  console.log("data: ", event.data)
  console.log(JSON.stringify(process.env))
}
