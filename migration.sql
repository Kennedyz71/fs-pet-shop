DROP TABLE IF EXISTS pet;
CREATE TABLE pet(
	id serial Primary Key,
	age integer, 
	kind varchar(50),
	name varchar(50)
);
