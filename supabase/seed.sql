-- Seed data for vehicles table (UP, India focused)
-- Uses the provided user_id: d8f29d38-f1c1-4f87-9ee9-08704f92d205
-- If you re-run, either clear the table or keep ON CONFLICT to skip existing rows.

INSERT INTO vehicles (
  user_id,
  vehicle_type,
  registration_number,
  rc_number,
  chassis_number,
  engine_number,
  make,
  model,
  year_of_manufacture,
  fuel_type,
  owner_name,
  purchase_date,
  purchase_price,
  pickup_location,
  scrap_yard_location,
  status
) VALUES
-- 2W - Petrol
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','2W','UP32AB1234','RC-UP-001','CH-UP-001','EN-UP-001','Hero','Splendor Plus',2019,'Petrol','Amit Verma','2023-07-12',42000,'Gomti Nagar, Lucknow','Transport Nagar, Lucknow','Purchased'),
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','2W','UP14CD5678','RC-UP-002','CH-UP-002','EN-UP-002','Honda','Activa 6G',2020,'Petrol','Neha Gupta','2023-09-05',52000,'Kaushambi, Ghaziabad','Dasna, Ghaziabad','Received'),
-- 2W - EV
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','2W','UP16EF9012','RC-UP-003','CH-UP-003','EN-UP-003','Ola','S1 Pro',2022,'EV','Rohit Singh','2024-01-18',110000,'Sector 62, Noida','Dadri Road, Noida','In Transit'),
-- 2W - CNG (aftermarket retrofit)
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','2W','UP78GH3456','RC-UP-004','CH-UP-004','EN-UP-004','Bajaj','Pulsar 150',2018,'CNG','Shivam Yadav','2023-04-03',38000,'Barra, Kanpur','Panki Industrial, Kanpur','Scrapped'),
-- 4W - CNG
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','4W','UP32JK7890','RC-UP-005','CH-UP-005','EN-UP-005','Maruti','WagonR CNG',2021,'CNG','Priya Tiwari','2024-02-10',480000,'Alambagh, Lucknow','Transport Nagar, Lucknow','Purchased'),
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','4W','UP14LM2345','RC-UP-006','CH-UP-006','EN-UP-006','Maruti','Dzire CNG',2020,'CNG','Saurabh Chauhan','2023-11-22',520000,'Vaishali, Ghaziabad','Loni Industrial Area, Ghaziabad','In Transit'),
-- 4W - Diesel
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','4W','UP16NP6789','RC-UP-007','CH-UP-007','EN-UP-007','Mahindra','Bolero',2017,'Diesel','Deepak Mishra','2023-06-15',350000,'Sector 15, Noida','Dadri Road, Noida','Received'),
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','4W','UP85QR0123','RC-UP-008','CH-UP-008','EN-UP-008','Tata','Ace',2016,'Diesel','Vikas Sharma','2023-03-27',280000,'Civil Lines, Aligarh','Transport Nagar, Lucknow','Scrapped'),
-- 4W - Petrol
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','4W','UP70ST4567','RC-UP-009','CH-UP-009','EN-UP-009','Hyundai','i20',2019,'Petrol','Ritika Agarwal','2023-08-19',600000,'Sigra, Varanasi','Manduadih, Varanasi','Purchased'),
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','4W','UP80UV8901','RC-UP-010','CH-UP-010','EN-UP-010','Honda','City',2018,'Petrol','Ankit Bansal','2023-05-30',750000,'Sector 18, Noida','Dadri Road, Noida','Received'),
-- 4W - EV
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','4W','UP32WX2345','RC-UP-011','CH-UP-011','EN-UP-011','Tata','Nexon EV',2022,'EV','Garima Saxena','2024-01-05',1450000,'Hazratganj, Lucknow','Transport Nagar, Lucknow','In Transit'),
-- Extra mix
('d8f29d38-f1c1-4f87-9ee9-08704f92d205','2W','UP32YZ6789','RC-UP-012','CH-UP-012','EN-UP-012','TVS','Jupiter',2021,'Petrol','Karan Srivastava','2023-10-09',62000,'Indira Nagar, Lucknow','Transport Nagar, Lucknow','Purchased');

-- Optional: prevent errors on re-run for existing registration numbers
-- You can wrap inserts with ON CONFLICT (registration_number) DO NOTHING if needed.
