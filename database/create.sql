-- MySQL
CREATE TABLE chat (
    id_chat   INTEGER NOT NULL AUTO_INCREMENT,
    name      VARCHAR(50) NOT NULL,
    lastmsg_timestamp  TIMESTAMP,
    lastmsg   VARCHAR(3000),
    PRIMARY KEY ( id_chat )
);

CREATE TABLE ismember (
    chat_id      INTEGER NOT NULL,
    user_email   VARCHAR(100) NOT NULL,
    PRIMARY KEY ( user_email, chat_id )
);

CREATE TABLE message (
    id_msg       INTEGER NOT NULL AUTO_INCREMENT,
    text         VARCHAR(3000) NOT NULL,
    timestamp    TIMESTAMP NOT NULL,
    user_email   VARCHAR(100) NOT NULL,
    chat_id      INTEGER NOT NULL,
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

ALTER TABLE ismember DROP FOREIGN KEY ismember_chat_fk;
ALTER TABLE ismember DROP FOREIGN KEY ismember_user_fk;
ALTER TABLE message DROP FOREIGN KEY message_chat_fk;
ALTER TABLE message DROP FOREIGN KEY message_user_fk;