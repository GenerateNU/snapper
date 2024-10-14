export type RegisterRequestBody = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export interface AuthResponse {
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    last_sign_in_at: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: Record<string, any>;
    identities: Array<{
      identity_id: string;
      id: string;
      user_id: string;
      identity_data: {
        email: string;
        email_verified: boolean;
        phone_verified: boolean;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string;
      created_at: string;
      updated_at: string;
      email: string;
    }>;
    created_at: string;
    updated_at: string;
  };
  session: {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
    refresh_token: string;
    user: {
      id: string;
      aud: string;
      role: string;
      email: string;
      email_confirmed_at: string;
      phone: string;
      last_sign_in_at: string;
      app_metadata: {
        provider: string;
        providers: string[];
      };
      user_metadata: Record<string, any>;
      identities: Array<{
        identity_id: string;
        id: string;
        user_id: string;
        identity_data: {
          email: string;
          email_verified: boolean;
          phone_verified: boolean;
          sub: string;
        };
        provider: string;
        last_sign_in_at: string;
        created_at: string;
        updated_at: string;
        email: string;
      }>;
      created_at: string;
      updated_at: string;
    };
  };
}
