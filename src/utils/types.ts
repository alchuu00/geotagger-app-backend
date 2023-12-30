export type UserType = {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  role?: string;
  points?: number;
  locations?: LocationType[];
  guesses?: GuessType[];
  actionLogs?: ActionLogType[];
  resetTokens?: ResetTokenType[];
};

export type LocationType = {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  image: string;
  longitude: string;
  latitude: string;
  user?: UserType;
  userId: string;
};

export type GuessType = {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  longitude: string;
  latitude: string;
  difference: string;
  points: number;
  order: number;
  user?: UserType;
  userId: string;
};

export type ActionLogType = {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  action: string;
  new_value: string;
  component_type: string;
  user?: UserType;
  userId: string;
};

export type ResetTokenType = {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  token: string;
  expiry_date: string;
  user?: UserType;
  userId: string;
};
