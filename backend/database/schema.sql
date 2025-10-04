CREATE TABLE SCHOOL (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT,
    location JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE COACH (
    coach_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_name TEXT NOT NULL,
    coach_email TEXT NOT NULL,
    coach_phone TEXT NOT NULL,
    school_name TEXT NOT NULL,
    coach_location TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TEAM (
    team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name TEXT,
    school_id UUID REFERENCES SCHOOL(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES COACH(coach_id) ON DELETE SET NULL,
    sport TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ATHLETE (
    athlete_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_name TEXT,
    team_id UUID REFERENCES TEAM(team_id) ON DELETE CASCADE,
    phone_number TEXT,  
    athlete_email TEXT,
    athlete_address TEXT,
    graduation_year INT,
    sport TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE FAMILY (
    parent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    parent_phone_number TEXT NOT NULL,
    location JSONB NOT NULL DEFAULT '{}'::jsonb,
    children JSONB NOT NULL DEFAULT '{}'::jsonb,
    team_id UUID REFERENCES TEAM(team_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ALUMNI (
    alumni_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumni_name TEXT NOT NULL,
    alumni_email TEXT NOT NULL,
    alumni_phone_number TEXT NOT NULL,
    location JSONB NOT NULL DEFAULT '{}'::jsonb, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EVENT (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_location TEXT NOT NULL,
    event_description TEXT NOT NULL,
    parent_id UUID REFERENCES FAMILY(parent_id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES ATHLETE(athlete_id) ON DELETE CASCADE,
    team_id UUID REFERENCES TEAM(team_id) ON DELETE CASCADE,
    event_status TEXT NOT NULL,
    event_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


