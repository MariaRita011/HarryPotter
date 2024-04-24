const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "harrypotter",
  password: "ds564",
  port: 5432,
});

let casaHogwarts = ["Grifinória", "Sonserina", "Corvinal", "Lufa-Lufa"];
let tipoSangues = ["Puro", "Mestiço", "Trouxa"];

app.get("/bruxos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bruxos");
    if (result.rowCount == 0) {
      res.status(201).send({ Aviso: "Nenhum bruxo cadastrado!" });
    } else {
      res.json({
        total: result.rowCount,
        bruxos: result.rows,
      });
    }
  } catch (error) {
    console.error("Erro ao obter os bruxos cadastrados:", error);
    res.status(500).send("Erro ao obter os bruxos cadastrados");
  }
});

app.post("/bruxos", async (req, res) => {
  try {
    const {
      nome,
      idade,
      casa_hogwarts,
      habilidade_especial,
      tipo_sangue,
      patrono,
    } = req.body;

    if(!nome || !idade || !casa_hogwarts || !habilidade_especial || !tipo_sangue) {
        res.status(500).send({
            erro: "Todos os campos devem ser preenchidos! (Exceto o campo patrono)",
          });
    }else if (!casaHogwarts.includes(casa_hogwarts)) {
      res.status(500).send({
        erro: "A casa do bruxo deve ser válida: Grifinória, Sonserina, Corvinal ou Lufa-Lufa! Tente novamente",
      });
    } else if (!tipoSangues.includes(tipo_sangue)) {
      res.status(500).send({
        erro: "O sangue do bruxo deve ser válido: Puro, Mestiço ou Trouxa! Tente novamente.",
      });
    } else {
      await pool.query(
        "INSERT INTO bruxos (nome, idade, casa_hogwarts, habilidade_especial, tipo_sangue, patrono) VALUES ($1, $2, $3, $4, $5, $6)",
        [nome, idade, casa_hogwarts, habilidade_especial, tipo_sangue, patrono]
      );
      res
        .status(201)
        .send({
          mensagem: `Bruxo de nome ${nome} foi adicionado a lista com sucesso!`,
        });
    }
  } catch (error) {
    console.error("Erro ao adicionar novo bruxo", error);
    res.status(500).send("Erro ao adicionar novo bruxo");
  }
});

app.put("/bruxos/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const {
      nome,
      idade,
      casa_hogwarts,
      habilidade_especial,
      tipo_sangue,
      patrono,
    } = req.body;

    if (!casaHogwarts.includes(casa_hogwarts)) {
        res.status(500).send({
          erro: "A casa do bruxo deve ser válida: Grifinória, Sonserina, Corvinal ou Lufa-Lufa! Tente novamente",
        });
      } else if (!tipoSangues.includes(tipo_sangue)) {
        res.status(500).send({
          erro: "O sangue do bruxo deve ser válido: Puro, Mestiço ou Trouxa! Tente novamente.",
        });
      } else {
        await pool.query(
            "UPDATE bruxos SET nome = $1, idade = $2, casa_hogwarts = $3, habilidade_especial = $4, tipo_sangue = $5, patrono = $6 WHERE id = $7",
            [nome,
                idade,
                casa_hogwarts,
                habilidade_especial,
                tipo_sangue,
                patrono, id]
          );
          res.status(200).send({ mensagem: `Bruxo de nome ${nome} foi alterado com sucesso!` });
      }

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).send("Erro ao atualizar usuário");
  }
});

app.delete("/bruxos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
        nome,
        } = req.body;

    await pool.query("DELETE FROM bruxos WHERE id = $1", [id]);
    res.status(200).send({ mensagem: `Bruxo de nome "${nome}" foi deletado da lista com sucesso!` });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).send("Erro ao excluir usuário");
  }
});

app.get('/bruxos/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query('SELECT * FROM bruxos WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send({ mensagem: `Bruxo de ID: ${id} não encontrado! Tente novamente.` });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao obter bruxo por ID.', error);
      res.status(500).send('Erro ao obter usuário por ID.');
    }
  }); 


  

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
