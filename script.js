const form = document.getElementById("formAluno");
const nomeInput = document.getElementById("nome_completo");
const usuarioInput = document.getElementById("usuario_acesso");
const senhaInput = document.getElementById("senha");
const emailInput = document.getElementById("email_aluno");
const observacaoInput = document.getElementById("observacao");
const mensagem = document.getElementById("mensagem");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const passwordBar = document.getElementById("passwordBar");
const obsCounter = document.getElementById("obsCounter");

const hints = {
  nome: document.getElementById("hint_nome"),
  usuario: document.getElementById("hint_usuario"),
  senha: document.getElementById("hint_senha"),
  email: document.getElementById("hint_email"),
  observacao: document.getElementById("hint_observacao")
};

function mostrarMensagem(texto, cor) {
  mensagem.style.color = cor;
  mensagem.textContent = texto;
}

function setFieldState(input, hintEl, isValid, errorMsg) {
  input.classList.remove("valid", "invalid");
  hintEl.classList.remove("error");

  if (isValid === true) {
    input.classList.add("valid");
  } else if (isValid === false) {
    input.classList.add("invalid");
    hintEl.classList.add("error");
    hintEl.textContent = errorMsg;
  }
}

function normalizarNome(valor) {
  return valor
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function validarNome(nome) {
  const limpo = nome.replace(/\s+/g, " ").trim();
  if (limpo.length < 5) return { ok: false, msg: "Nome muito curto." };
  if (!limpo.includes(" ")) return { ok: false, msg: "Informe nome e sobrenome." };
  return { ok: true, msg: "" };
}

function validarUsuario(usuario) {
  if (usuario.length < 4) return { ok: false, msg: "Usuário precisa ter ao menos 4 caracteres." };
  if (!/^[a-zA-Z0-9._]+$/.test(usuario)) return { ok: false, msg: "Use apenas letras, números, ponto e underscore." };
  return { ok: true, msg: "" };
}

function scoreSenha(senha) {
  let score = 0;
  if (senha.length >= 6) score += 25;
  if (/[A-Z]/.test(senha)) score += 20;
  if (/[a-z]/.test(senha)) score += 20;
  if (/\d/.test(senha)) score += 20;
  if (/[^A-Za-z0-9]/.test(senha)) score += 15;
  return Math.min(score, 100);
}

function validarSenha(senha) {
  if (senha.length < 6) return { ok: false, msg: "Senha deve ter no mínimo 6 caracteres." };
  const forte = /[A-Z]/.test(senha) && /[a-z]/.test(senha) && /\d/.test(senha);
  if (!forte) return { ok: false, msg: "Melhore a senha com maiúsculas, minúsculas e números." };
  return { ok: true, msg: "" };
}

function atualizarBarraSenha(senha) {
  const score = scoreSenha(senha);
  passwordBar.style.width = score + "%";

  if (score < 40) {
    passwordBar.style.backgroundColor = "#dc2626";
  } else if (score < 70) {
    passwordBar.style.backgroundColor = "#d97706";
  } else {
    passwordBar.style.backgroundColor = "#16a34a";
  }
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(email)) return { ok: false, msg: "E-mail inválido." };
  return { ok: true, msg: "" };
}

function validarObservacao(obs) {
  if (obs.length > 255) return { ok: false, msg: "Observação excede 255 caracteres." };
  return { ok: true, msg: "" };
}

function atualizarContadorObservacao() {
  const total = observacaoInput.value.length;
  obsCounter.textContent = total + "/255";
  obsCounter.style.color = total > 230 ? "#d97706" : "#475569";
}

function validarFormularioCompleto() {
  const nomeCheck = validarNome(nomeInput.value.trim());
  const usuarioCheck = validarUsuario(usuarioInput.value.trim());
  const senhaCheck = validarSenha(senhaInput.value.trim());
  const emailCheck = validarEmail(emailInput.value.trim());
  const obsCheck = validarObservacao(observacaoInput.value.trim());

  setFieldState(nomeInput, hints.nome, nomeCheck.ok, nomeCheck.msg);
  setFieldState(usuarioInput, hints.usuario, usuarioCheck.ok, usuarioCheck.msg);
  setFieldState(senhaInput, hints.senha, senhaCheck.ok, senhaCheck.msg);
  setFieldState(emailInput, hints.email, emailCheck.ok, emailCheck.msg);
  setFieldState(observacaoInput, hints.observacao, obsCheck.ok, obsCheck.msg);

  return nomeCheck.ok && usuarioCheck.ok && senhaCheck.ok && emailCheck.ok && obsCheck.ok;
}

nomeInput.addEventListener("blur", () => {
  nomeInput.value = normalizarNome(nomeInput.value);
  const check = validarNome(nomeInput.value);
  hints.nome.textContent = check.ok ? "Nome preenchido corretamente." : check.msg;
  setFieldState(nomeInput, hints.nome, check.ok, check.msg);
});

usuarioInput.addEventListener("input", () => {
  usuarioInput.value = usuarioInput.value.replace(/\s/g, "");
  const check = validarUsuario(usuarioInput.value.trim());
  hints.usuario.textContent = check.ok ? "Usuário válido." : check.msg;
  setFieldState(usuarioInput, hints.usuario, check.ok, check.msg);
});

senhaInput.addEventListener("input", () => {
  atualizarBarraSenha(senhaInput.value);
  const check = validarSenha(senhaInput.value.trim());
  hints.senha.textContent = check.ok ? "Senha com boa estrutura." : check.msg;
  setFieldState(senhaInput, hints.senha, check.ok, check.msg);
});

emailInput.addEventListener("blur", () => {
  const check = validarEmail(emailInput.value.trim());
  hints.email.textContent = check.ok ? "E-mail válido." : check.msg;
  setFieldState(emailInput, hints.email, check.ok, check.msg);
});

observacaoInput.addEventListener("input", () => {
  atualizarContadorObservacao();
  const check = validarObservacao(observacaoInput.value.trim());
  setFieldState(observacaoInput, hints.observacao, check.ok, check.msg);
  if (check.ok) {
    hints.observacao.textContent = "Texto opcional para complementar o cadastro.";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validarFormularioCompleto()) {
    mostrarMensagem("Revise os campos destacados.", "red");
    return;
  }

  const nome = normalizarNome(nomeInput.value.trim());
  const usuario = usuarioInput.value.trim();
  const senha = senhaInput.value.trim();
  const email = emailInput.value.trim();
  const observacao = observacaoInput.value.trim();

  const aluno = {
    nome_completo: nome,
    usuario_acesso: usuario,
    senha_hash: senha,
    email_aluno: email,
    observacao: observacao
  };

  submitBtn.disabled = true;
  btnText.textContent = "Enviando...";
  mostrarMensagem("Enviando cadastro...", "#0ea5e9");

  try {
    const response = await fetch("https://localhost:7253/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno)
    });

    if (response.ok) {
      mostrarMensagem("Aluno cadastrado com sucesso", "green");
      form.reset();
      atualizarBarraSenha("");
      atualizarContadorObservacao();

      document.querySelectorAll("input, textarea").forEach((el) => {
        el.classList.remove("valid", "invalid");
      });

      hints.nome.textContent = "Use nome e sobrenome.";
      hints.usuario.textContent = "Sem espaços. Use letras, números, ponto e underscore.";
      hints.senha.textContent = "Use maiúsculas, minúsculas, números e símbolo.";
      hints.email.textContent = "Informe um e-mail válido.";
      hints.observacao.textContent = "Evite dados sensíveis aqui.";
    } else {
      mostrarMensagem("Erro ao cadastrar aluno", "red");
    }
  } catch (error) {
    mostrarMensagem("Falha na comunicação com o servidor", "red");
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "Cadastrar";
  }
});

atualizarContadorObservacao();