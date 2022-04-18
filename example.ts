import airplane from './index'


type Params = {
}

// Put the main logic of the task in this function.
export default async function(params: Params) {
  console.log('parameters:', params);

  const run = await airplane.execute("capitalize", {
    input: "hello world"
  })

  return run
}
