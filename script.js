const API_URL = 'https://backend-alunos.onrender.com/api/alunos'; 

document.getElementById('formAluno').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome_completo = document.getElementById('nome_completo').value.trim();
    const usuario_acesso = document.getElementById('usuario_acesso').value.trim();
    const senha_hash = document.getElementById('senha_hash').value;
    const email_aluno = document.getElementById('email_aluno').value.trim();
    const observacao = document.getElementById('observacao').value.trim();

    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.innerHTML = '';
    mensagemDiv.className = 'mensagem';

    if (!nome_completo || !usuario_acesso || !senha_hash || !email_aluno) {
        return mostrarMensagem('Preencha todos os campos obrigatórios.', 'erro');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_aluno)) {
        return mostrarMensagem('Digite um e-mail válido (ex: aluno@dominio.com).', 'erro');
    }

    if (senha_hash.length < 4) {
        return mostrarMensagem('A senha deve ter pelo menos 4 caracteres.', 'erro');
    }

    const dados = { nome_completo, usuario_acesso, senha_hash, email_aluno, observacao };

    try {
        mostrarMensagem('Enviando dados...', 'sucesso');

        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado.sucesso) {
            mostrarMensagem('✅ ' + resultado.mensagem, 'sucesso');
            document.getElementById('formAluno').reset();
        } else {
            const erros = resultado.erros?.join(', ') || 'Erro desconhecido.';
            mostrarMensagem('❌ ' + erros, 'erro');
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        mostrarMensagem('❌ Não foi possível conectar ao servidor. Verifique sua internet.', 'erro');
    }
});

function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.textContent = texto;
    msgDiv.className = `mensagem ${tipo}`;
}
