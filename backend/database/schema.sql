CREATE TABLE SCHOOL (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    children JSONB NOT NULL DEFAULT '{}'::jsonb,
    city TEXT NOT NULL,
);


CREATE TABLE TEAM {
    team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT NOT NULL,
    school_id REFERENCES schools(id) on DELETE CASCADE,
    sport TEXT NOT NULL,

}


CREATE TABLE ATHLETE {
    athlete_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_name TEXT NOT NULL,
    team_id UUID REFERENCES teams(team_id) on DELETE CASCADE,
    phone_number INT NOT NULL,
    athlete_email TEXT NOT NULL,
    athlete_address TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    graduation_year INT NOT NULL,
}


CREATE TABLE FAMILY {
    parent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone_number TEXT NOT NULL,
    location JSONB NOT NULL DEFAULT '{}'::jsonb,
    children JSONB NOT NULL DEFAULT '{}'::jsonb,

}

CREATE TABLE TEAM_FAMILY {
    team_id UUID REFERENCES team(team_id) on DELETE CASCADE,
    parent_id UUID REFERENCES parents(parent_id) on DELETE CASCADE,     
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
}

CREAT TABLE ATHLETE_FAMILY {
    athlete_id UUID REFERENCES athletes(athlete_id) on DELETE CASCADE,
    parent_id UUID REFERENCES parents(parent_id) on DELETE CASCADE,     
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
}

