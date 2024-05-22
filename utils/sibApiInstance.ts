const SibApiV3Sdk = require("@getbrevo/brevo");
const sibApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = sibApiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.SMTP_API_KEY;

export default sibApiInstance;
