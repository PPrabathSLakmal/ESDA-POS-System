-- auto-generated definition
create table Customer
(
    id      int auto_increment
        primary key,
    name    varchar(100) not null,
    address varchar(250) not null,
    contact varchar(20)  not null,
    constraint contact
        unique (contact)
);
