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
          console.log(nome,
            idade,
            casa_hogwarts,
            habilidade_especial,
            tipo_sangue,
            patrono);
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

    const result = await pool.query('SELECT * FROM bruxos WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send({ mensagem: `Bruxo de ID: ${id} não encontrado! Tente novamente.` });
      } else {
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
      }

  } catch (error) {
    console.error("Erro ao atualizar bruxo:", error);
    res.status(500).send("Erro ao atualizar bruxo");
  }
});

app.delete("/bruxos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM bruxos WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send({ mensagem: `Bruxo de ID: ${id} não encontrado! Tente novamente.` });
      } else {
        await pool.query("DELETE FROM bruxos WHERE id = $1", [id]);
        res.status(200).send({ mensagem: `Bruxo de id:${id} foi deletado da lista com sucesso!` });
      }
  } catch (error) {
    console.error("Erro ao excluir bruxo:", error);
    res.status(500).send("Erro ao excluir bruxo");
  }
});






app.get("/varinhas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM varinhas");
    if (result.rowCount == 0) {
      res.status(201).send({ Aviso: "Nenhum varinha cadastrado!" });
    } else {
      res.json({
        total: result.rowCount,
        varinhas: result.rows,
      });
    }
  } catch (error) {
    console.error("Erro ao obter os varinhas cadastrados:", error);
    res.status(500).send("Erro ao obter os varinhas cadastrados");
  }
});

app.post("/varinhas", async (req, res) => {
  try {
    const {
      material,
      comprimento,
      nucleo,
      data_fabricacao,
    } = req.body;

    let data = new Date(data_fabricacao);
    let hoje = new Date();

    if(!material || !comprimento || !nucleo || !data_fabricacao) {
        res.status(500).send({
            erro: "Todos os campos devem ser preenchidos!",
          });
    }else if (data > hoje) {
      res.status(500).send({
        erro: "A data de fabricação da varinha não podee ser maior que hoje!",
      });
    } else if (comprimento < 10 || comprimento > 60) {
      res.status(500).send({
        erro: "O tamanho da varinha deve ser entre 10 e 60 centrimentros.",
      });
    } else {
      await pool.query(
        "INSERT INTO varinhas (material, comprimento, nucleo, data_fabricacao) VALUES ($1, $2, $3, $4)",
        [material, comprimento, nucleo, data_fabricacao]
      );
      res
        .status(201)
        .send({
          mensagem: `Nova varinha foi adicionado a lista com sucesso!`,
        });
    }
  } catch (error) {
    console.error("Erro ao adicionar novo varinha", error);
    res.status(500).send("Erro ao adicionar novo varinha");
  }
});

app.put("/varinhas/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const {
      material,
      comprimento,
      nucleo,
      data_fabricacao,
    } = req.body;

    let data = new Date(data_fabricacao);
    let hoje = new Date();

    const result = await pool.query('SELECT * FROM varinhas WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send({ mensagem: `Varinha de ID: ${id} não encontrado! Tente novamente.` });
      } else {
        if (data > hoje) {
          res.status(500).send({
            erro: "A data de fabricação da varinha não podee ser maior que hoje!",
          });
        } else if (comprimento < 10 || comprimento > 60) {
          res.status(500).send({
            erro: "O tamanho da varinha deve ser entre 10 e 60 centrimentros.",
          });
        } else {
          await pool.query(
              "UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, data_fabricacao = $4 WHERE id = $5",
              [material,
                  comprimento,
                  nucleo,
                  data_fabricacao,id]
            );
            res.status(200).send({ mensagem: `Varinha foi alterado com sucesso!` });
        }
      }

  } catch (error) {
    console.error("Erro ao atualizar varinha:", error);
    res.status(500).send("Erro ao atualizar varinha");
  }
});
  
app.delete("/varinhas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM varinhas WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send({ mensagem: `Varinha de ID: ${id} não encontrado! Tente novamente.` });
      } else {
        await pool.query("DELETE FROM varinhas WHERE id = $1", [id]);
        res.status(200).send({ mensagem: `Varinha de id:${id} foi deletado da lista com sucesso!` });
      }
  } catch (error) {
    console.error("Erro ao excluir varinha:", error);
    res.status(500).send("Erro ao excluir varinha");
  }
});

app.get('/bruxos/nome/:nome', async (req, res) => {
  try {
    const { nome } = req.params;

    const result = await pool.query(`SELECT * FROM bruxos WHERE nome LIKE '%${nome}%'`);
    if (result.rowCount === 0) {
      res.status(404).send({ mensagem: `Bruxo não encontrado! Tente novamente.` });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao obter bruxo por nome.', error);
    res.status(500).send('Erro ao obter usuário por nome.');
  }
});

app.get('/varinhas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM varinhas WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).send({ mensagem: `Varinha de ID: ${id} não encontrado! Tente novamente.` });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erro ao obter varinha por ID.', error);
    res.status(500).send('Erro ao obter varinha por ID.');
  }
}); 

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
