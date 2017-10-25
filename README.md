# pet_hotel
Your team has started a new business in Uptown for dog-enthusiasts that also need to vacation without their beloved pets

## application functionality

-check in their pet
-check out their pet
-update their pet's info
-remove their pet

Technologies
------------
- JQuery
- Node
- Express
- SQL

## Table Creation
```
CREATE TABLE owners (
    id serial PRIMARY KEY,
    first VARCHAR(20),
    last VARCHAR(20)
);

CREATE TABLE pets (
    id serial PRIMARY KEY,
    name VARCHAR(20),
    breed VARCHAR(20),
    color VARCHAR (50),
    owner_id INT references "owners"
);

CREATE TABLE visits (
    id serial PRIMARY KEY,
    checkin DATE,
    checkout DATE,
    pet_id INT references "pets"
);

```
## Test Data

```
INSERT INTO "owners" ("first", "last")
VALUES ('David', 'Beaudway'), ('Emi','Chen'), ('Elvis', 'Hang'), ('Emma', 'Stout');

INSERT INTO "pets" ("name", "breed", "color", "owner_id")
VALUES ('Lucy', 'Terrier', 'Black and White', '1'), ('Shadow','Cat', 'Black', '2'), ('Bird', 'Bird', 'Green', '3'), ('Ikey', 'Cat', 'Black', '3');

INSERT INTO "visits" ("checkin", "pet_id") VALUES ('10/25/2017', '3');
```

