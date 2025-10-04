CREATE TABLE SCHOOL (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location JSONB NOT NULL DEFAULT '{}'::jsonb,

);

CREATE TABLE TEAM (
    team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT NOT NULL,
    school_id UUID REFERENCES SCHOOL(id) ON DELETE CASCADE,
    sport TEXT NOT NULL
);

CREATE TABLE ATHLETE (
    athlete_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_name TEXT NOT NULL,
    team_id UUID REFERENCES TEAM(team_id) ON DELETE CASCADE,
    phone_number BIGINT NOT NULL,  
    athlete_email TEXT NOT NULL,
    athlete_address TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    graduation_year INT NOT NULL
);


CREATE TABLE ALUMNI (

    alumni_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumni_name TEXT NOT NULL,
    alumni_email TEXT NOT NULL,
    alumni_phone_number TEXT NOT NULL,
    location JSONB NOT NULL DEFAULT '{}'::jsonb, 
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE FAMILY (
    parent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone_number TEXT NOT NULL,
    location JSONB NOT NULL DEFAULT '{}'::jsonb,
    children JSONB NOT NULL DEFAULT '{}'::jsonb,
    team_id UUID REFERENCES TEAM(team_id) ON DELETE CASCADE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


