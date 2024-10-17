-- Tabela de telefones
CREATE TABLE phones (
  id SERIAL PRIMARY KEY,
  number VARCHAR(11) NOT NULL UNIQUE,
  carrier_id INT NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (carrier_id) REFERENCES carriers(id),
  CHECK (char_length(number) = 11)
);

-- Tabela de recargas
CREATE TABLE recharges (
  id SERIAL PRIMARY KEY,
  phone_id INT NOT NULL,
  value DECIMAL(10, 2) NOT NULL CHECK (value >= 10 AND value <= 1000),
  recharge_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (phone_id) REFERENCES phones(id)
);
