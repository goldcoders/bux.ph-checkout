
import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import { BUX_API_KEY, BUX_BASE_URL, BUX_CLIENT_ID, BUX_NOTIFY_URL, BUX_REDIRECT_URL, SITE_DOMAIN } from "./env-check";
import { bodyInterface } from "./interface/body";


const apiURL = `${BUX_BASE_URL}/open/checkout`

const handler: Handler = async (event:HandlerEvent, context:HandlerContext ) => {
  
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed!" }),
      headers: { Allow: "POST" },
    };
  }
  
  if (event.headers.host !== SITE_DOMAIN){
     return {
          statusCode: 403,
          body: JSON.stringify({ error: "Forbidden Access To Api" }),
          headers: { Allow: "POST" },
        };
  }
         
  let params = null;
  try {
    params =  JSON.parse(event.body|| '{}');
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
  const {
    amount, 
    description, 
    email,
    contact,
    name,
    param1 = '',
    param2 = ''
  } : 
  {
    amount: number, 
    description: string , 
    email: string, 
    contact: string, 
    name: string,
    param1: string,
    param2: string,
  } = params;

  if (!amount || !description || !email || !contact||!name) {
    let error = {
      statusCode: 422,
      body: `Validation Error: amount: ${amount}, description: ${description}, email: ${email}, contact: ${contact}, name: ${name}`,
    };
    return error;
  }
  
  const body: bodyInterface = {
    "req_id": uuidv4(),
    "client_id": `${BUX_CLIENT_ID}`,
    "amount": amount,
    "description": description,
    "expiry": 2,
    "email": email,
    "contact": contact,
    "name": name,
    "notification_url": `${BUX_NOTIFY_URL}`,
    "redirect_url": `${BUX_REDIRECT_URL}`,
    "param1": param1,
    "param2": param2,
  };

  const payload = {
    headers: { 
      Accept: 'application/json', 
      'x-api-key': `${BUX_API_KEY}` 
    },
    method: 'POST',
    body: JSON.stringify(body)
  };
  
  try {
    const response = await fetch(apiURL, payload);
    
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }

}

export { handler };
