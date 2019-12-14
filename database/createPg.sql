-- postgreSql create script

CREATE SEQUENCE chat_seq;

CREATE TABLE chat (
    id_chat   INT NOT NULL DEFAULT NEXTVAL ('chat_seq'),
    name      VARCHAR(50) NOT NULL,
    lastmsg_timestamp  TIMESTAMP,
    lastmsg   VARCHAR(3000),
    PRIMARY KEY ( id_chat )
);

CREATE TABLE ismember (
    chat_id      INT NOT NULL,
    user_email   VARCHAR(100) NOT NULL,
    PRIMARY KEY ( user_email, chat_id )
);

CREATE SEQUENCE message_seq;

CREATE TABLE message (
    id_msg       INT NOT NULL DEFAULT NEXTVAL ('message_seq'),
    text         VARCHAR(3000) NOT NULL,
    timestamp    TIMESTAMP NOT NULL,
    user_email   VARCHAR(100) NOT NULL,
    chat_id      INT NOT NULL,
    PRIMARY KEY ( id_msg )
);

CREATE TABLE users (
    email      VARCHAR(100) NOT NULL,
    name       VARCHAR(250) NOT NULL,
    password   VARCHAR(100) NOT NULL,
    PRIMARY KEY ( email )
);

ALTER TABLE ismember
    ADD CONSTRAINT ismember_chat_fk FOREIGN KEY ( chat_id )
        REFERENCES chat ( id_chat );

ALTER TABLE ismember
    ADD CONSTRAINT ismember_user_fk FOREIGN KEY ( user_email )
        REFERENCES users ( email );

ALTER TABLE message
    ADD CONSTRAINT message_chat_fk FOREIGN KEY ( chat_id )
        REFERENCES chat ( id_chat );

ALTER TABLE message
    ADD CONSTRAINT message_user_fk FOREIGN KEY ( user_email )
        REFERENCES users ( email );


-- minify
--  CREATE SEQUENCE chat_seq; CREATE TABLE chat( id_chat INT NOT NULL DEFAULT NEXTVAL ('chat_seq'), name VARCHAR(50) NOT NULL, lastmsg_timestamp TIMESTAMP, lastmsg VARCHAR(3000), PRIMARY KEY ( id_chat) ); CREATE TABLE ismember ( chat_id INT NOT NULL, user_email VARCHAR(100) NOT NULL, PRIMARY KEY ( user_email, chat_id ) ); CREATE SEQUENCE message_seq; CREATE TABLE message ( id_msg INT NOT NULL DEFAULT NEXTVAL ('message_seq'), text VARCHAR(3000) NOT NULL, timestamp TIMESTAMP NOT NULL, user_email VARCHAR(100) NOT NULL, chat_id INT NOT NULL, PRIMARY KEY ( id_msg ) ); CREATE TABLE users ( email VARCHAR(100) NOT NULL, name VARCHAR(250) NOT NULL, password VARCHAR(100) NOT NULL, PRIMARY KEY ( email ) ); ALTER TABLE ismember ADD CONSTRAINT ismember_chat_fk FOREIGN KEY ( chat_id ) REFERENCES chat ( id_chat ); ALTER TABLE ismember ADD CONSTRAINT ismember_user_fk FOREIGN KEY ( user_email ) REFERENCES users ( email ); ALTER TABLE message ADD CONSTRAINT message_chat_fk FOREIGN KEY ( chat_id ) REFERENCES chat ( id_chat ); ALTER TABLE message ADD CONSTRAINT message_user_fk FOREIGN KEY ( user_email ) REFERENCES users ( email );