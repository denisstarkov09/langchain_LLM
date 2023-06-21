import type { NextApiRequest, NextApiResponse } from "next";

export default async function getNameSpaceData(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { memberID } = req.body;
    const auth = process.env.API_TOKEN;
    console.log('memberID :', memberID);
    console.log('Auth :', auth);
    const response = await fetch(`https://us-central1-digitalwallet-28069.cloudfunctions.net/apis/admin/employee/${memberID}`, {
        method: 'GET',
        headers: {
            'Authorization': auth,
        }
    });
    const result = await response.json();
    console.log('result: ', result);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({error: "error with fetching data"});
  }
}