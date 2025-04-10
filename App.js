// Gerenciar LocalStorage
const STORAGE_KEY = 'portfolio_projects';
let projectsData = [];
let currentProjectId = null;

// Carregar projetos do LocalStorage
function loadProjects() {
    const storedProjects = localStorage.getItem(STORAGE_KEY);
    if (storedProjects) {
        projectsData = JSON.parse(storedProjects);
        renderProjects();
    } else {
        // Se não houver projetos no localStorage, adicionar alguns exemplos
        const exampleProjects = [
            {
                id: generateId(),
                title: 'App de Finanças Pessoais',
                image: 'https://via.placeholder.com/400x200/333/9d4edd?text=Projeto+1',
                tags: ['React', 'Node.js', 'MongoDB'],
                description: 'Aplicativo para controle de finanças pessoais com gráficos e relatórios detalhados.',
                url: 'https://github.com'
            },
            {
                id: generateId(),
                title: 'E-commerce de Produtos',
                image: 'https://via.placeholder.com/400x200/333/9d4edd?text=Projeto+2',
                tags: ['Vue.js', 'Express', 'MySQL'],
                description: 'Plataforma completa de e-commerce com sistema de pagamentos e gerenciamento de produtos.',
                url: 'https://github.com'
            },
            {
                id: generateId(),
                title: 'App de Previsão do Tempo',
                image: 'https://via.placeholder.com/400x200/333/9d4edd?text=Projeto+3',
                tags: ['JavaScript', 'API', 'CSS3'],
                description: 'Aplicativo que mostra previsão do tempo para qualquer local, com interface adaptativa.',
                url: 'https://github.com'
            }
        ];
        
        projectsData = exampleProjects;
        saveProjects();
        renderProjects();
    }
}

// Salvar projetos no LocalStorage
function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsData));
}

// Gerar ID único para cada projeto
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Renderizar projetos na tela
function renderProjects() {
    const container = document.getElementById('project-container');
    container.innerHTML = '';
    
    projectsData.forEach((project, index) => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project-card');
        projectElement.setAttribute('data-id', project.id);
        projectElement.style.animationDelay = `${index * 0.1}s`;
        
        // Verificar se o projeto tem URL
        const hasUrl = project.url && project.url.trim() !== '';
        
        projectElement.innerHTML = `
            <div class="delete-project" data-id="${project.id}">×</div>
            <img src="${project.image}" alt="${project.title}" class="project-img">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p class="project-desc">${project.description}</p>
            </div>
        `;
        
        // Tornar o cartão clicável se tiver URL
        if (hasUrl) {
            projectElement.addEventListener('click', function(e) {
                // Verificar se o clique não foi no botão de deletar
                if (!e.target.closest('.delete-project')) {
                    window.open(project.url, '_blank');
                }
            });
        } else {
            projectElement.addEventListener('click', function(e) {
                // Verificar se o clique não foi no botão de deletar
                if (!e.target.closest('.delete-project')) {
                    showToast('Este projeto não possui URL disponível');
                }
            });
        }
        
        container.appendChild(projectElement);
        
        // Adicionar evento para excluir projeto
        projectElement.querySelector('.delete-project').addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            openConfirmModal(id);
        });
    });
    
    // Adicionar observador para animações
    const projectCards = document.querySelectorAll('.project-card');
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    projectCards.forEach(card => {
        observer.observe(card);
    });
}

// Abrir modal de confirmação para excluir
function openConfirmModal(id) {
    currentProjectId = id;
    document.getElementById('confirm-modal').style.display = 'flex';
}

// Excluir projeto
function deleteProject(id) {
    projectsData = projectsData.filter(project => project.id !== id);
    saveProjects();
    renderProjects();
    showToast('Projeto excluído com sucesso!');
}

// Mostrar toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Evento para confirmar exclusão
document.getElementById('confirm-delete').addEventListener('click', function() {
    if (currentProjectId) {
        deleteProject(currentProjectId);
        document.getElementById('confirm-modal').style.display = 'none';
        currentProjectId = null;
    }
});

// Evento para cancelar exclusão
document.getElementById('cancel-delete').addEventListener('click', function() {
    document.getElementById('confirm-modal').style.display = 'none';
    currentProjectId = null;
});

// Fechar modal de confirmação ao clicar fora
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('confirm-modal')) {
        document.getElementById('confirm-modal').style.display = 'none';
        currentProjectId = null;
    }
});

// Abrir o modal de adicionar projeto
document.getElementById('add-project').addEventListener('click', function() {
    document.getElementById('project-modal').style.display = 'flex';
});

// Fechar o modal de adicionar projeto
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('project-modal').style.display = 'none';
});

// Fechar o modal de adicionar projeto ao clicar fora
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('project-modal')) {
        document.getElementById('project-modal').style.display = 'none';
    }
});

// Gerenciar tags
const tagInput = document.getElementById('project-tags');
const tagContainer = document.getElementById('tags-container');
const tags = [];

tagInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && tagInput.value.trim() !== '') {
        e.preventDefault();
        const tag = tagInput.value.trim();
        
        if (!tags.includes(tag)) {
            tags.push(tag);
            const tagElement = document.createElement('div');
            tagElement.classList.add('added-tag');
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" data-tag="${tag}">&times;</span>
            `;
            tagContainer.appendChild(tagElement);
            tagInput.value = '';
            
            // Adicionar evento para remover a tag
            tagElement.querySelector('.remove-tag').addEventListener('click', function() {
                const tagToRemove = this.getAttribute('data-tag');
                const index = tags.indexOf(tagToRemove);
                if (index !== -1) {
                    tags.splice(index, 1);
                    tagElement.remove();
                }
            });
        }
    }
});

// Adicionar novo projeto
document.getElementById('project-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('project-title').value;
    const imageUrl = document.getElementById('project-image').value || `https://via.placeholder.com/400x200/333/9d4edd?text=${encodeURIComponent(title)}`;
    const description = document.getElementById('project-description').value;
    const projectUrl = document.getElementById('project-url').value;
    
    // Criar objeto do projeto
    const newProject = {
        id: generateId(),
        title,
        image: imageUrl,
        tags: [...tags],
        description,
        url: projectUrl
    };
    
    // Adicionar projeto aos dados
    projectsData.push(newProject);
    
    // Salvar no localStorage
    saveProjects();
    
    // Renderizar projetos atualizados
    renderProjects();
    
    // Mostrar notificação
    showToast('Projeto adicionado com sucesso!');
    
    // Limpar o formulário
    this.reset();
    tagContainer.innerHTML = '';
    tags.length = 0;
    
    // Fechar o modal
    document.getElementById('project-modal').style.display = 'none';
});

// Carregar projetos ao iniciar a página
window.addEventListener('DOMContentLoaded', loadProjects);