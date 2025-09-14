import {
  SSMClient,
  GetParameterCommand,
  GetParameterCommandInput,
} from '@aws-sdk/client-ssm';

export interface AppConfig {
  environment: string;
  applicationStage: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  google: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
  auth: {
    allowedEmails: string[];
  };
  aws: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
}

let ssmClient: SSMClient | null = null;

const getSSMClient = (): SSMClient => {
  if (!ssmClient) {
    // For local dev with AWS SSO, let AWS SDK handle credential resolution
    // For Lambda, IAM role is used automatically
    ssmClient = new SSMClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }
  return ssmClient;
};

const getParameter = async (name: string): Promise<string | null> => {
  try {
    const client = getSSMClient();
    const input: GetParameterCommandInput = {
      Name: name,
      WithDecryption: true,
    };
    const command = new GetParameterCommand(input);
    const response = await client.send(command);
    return response.Parameter?.Value || null;
  } catch (error) {
    console.warn(`Failed to get parameter ${name} from AWS:`, `${error}`);
    return null;
  }
};

const getEnvValue = (key: string, fallback?: string): string => {
  return process.env[key] || fallback || '';
};

export default async (): Promise<AppConfig> => {
  const environment = getEnvValue('NODE_ENV', 'development');
  // Map NODE_ENV to our Terraform environment naming
  const terraformEnv = environment === 'development' ? 'dev' : environment;
  const parameterPrefix = `/portfolio/${terraformEnv}`;

  // Try AWS Parameter Store first, fallback to .env
  const jwtSecret =
    (await getParameter(`${parameterPrefix}/jwt_secret`)) ||
    getEnvValue('JWT_SECRET');

  const googleClientId =
    (await getParameter(`${parameterPrefix}/google_client_id`)) ||
    getEnvValue('GOOGLE_OAUTH_CLIENT_ID');

  const googleClientSecret =
    (await getParameter(`${parameterPrefix}/google_client_secret`)) ||
    getEnvValue('GOOGLE_OAUTH_CLIENT_SECRET');

  const allowedEmailsStr =
    (await getParameter(`${parameterPrefix}/allowed_emails`)) ||
    getEnvValue('ALLOWED_EMAILS', '');

  const applicationStage =
    (await getParameter(`${parameterPrefix}/application_stage`)) ||
    getEnvValue('APPLICATION_STAGE', 'dev');

  const allowedEmails = allowedEmailsStr
    .split(',')
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }

  if (!googleClientId || !googleClientSecret) {
    throw new Error('Google OAuth credentials are required');
  }

  if (allowedEmails.length === 0) {
    throw new Error('At least one allowed email must be configured');
  }

  return {
    environment,
    applicationStage,
    jwt: {
      secret: jwtSecret,
      expiresIn: '7d',
    },
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      callbackUrl: getEnvValue(
        'GOOGLE_CALLBACK_URL',
        'http://localhost:3000/auth/google/callback',
      ),
    },
    auth: {
      allowedEmails,
    },
    aws: {
      region: getEnvValue('AWS_REGION', 'us-east-1'),
      accessKeyId: getEnvValue('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getEnvValue('AWS_SECRET_ACCESS_KEY'),
    },
  };
};
