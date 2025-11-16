// ===================================
// AI Prompt Optimizer - Core Logic
// ===================================

class PromptOptimizer {
    constructor() {
        this.taskPatterns = {
            coding: {
                keywords: ['code', 'function', 'program', 'script', 'algorithm', 'debug', 'implement', 'develop', 'api', 'class', 'variable', 'syntax'],
                role: 'expert software developer and programmer',
                domain: 'software development'
            },
            writing: {
                keywords: ['write', 'article', 'blog', 'essay', 'content', 'paragraph', 'story', 'post', 'copy', 'draft'],
                role: 'professional content writer and editor',
                domain: 'content creation'
            },
            analysis: {
                keywords: ['analyze', 'analyse', 'examine', 'evaluate', 'assess', 'review', 'compare', 'investigate'],
                role: 'analytical expert and researcher',
                domain: 'data analysis and research'
            },
            explanation: {
                keywords: ['explain', 'describe', 'how does', 'what is', 'why', 'define', 'clarify', 'elaborate'],
                role: 'knowledgeable educator and expert communicator',
                domain: 'education and explanation'
            },
            summary: {
                keywords: ['summarize', 'summarise', 'tldr', 'brief', 'overview', 'synopsis', 'condense', 'key points'],
                role: 'expert summarization specialist',
                domain: 'information synthesis'
            },
            translation: {
                keywords: ['translate', 'translation', 'language', 'convert to'],
                role: 'professional translator and linguist',
                domain: 'language translation'
            },
            creative: {
                keywords: ['create', 'generate', 'design', 'imagine', 'brainstorm', 'invent', 'ideate', 'creative'],
                role: 'creative professional and innovative thinker',
                domain: 'creative generation'
            },
            qa: {
                keywords: ['answer', 'question', 'what', 'who', 'where', 'when', 'which', 'respond'],
                role: 'knowledgeable assistant and problem solver',
                domain: 'question answering'
            }
        };
    }

    detectTaskType(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        let maxScore = 0;
        let detectedType = 'general';

        for (const [type, config] of Object.entries(this.taskPatterns)) {
            let score = 0;
            config.keywords.forEach(keyword => {
                if (lowerPrompt.includes(keyword)) {
                    score++;
                }
            });

            if (score > maxScore) {
                maxScore = score;
                detectedType = type;
            }
        }

        return maxScore > 0 ? detectedType : 'general';
    }

    extractKeyElements(prompt) {
        const elements = {
            hasLength: /\b(\d+\s*(word|character|sentence|paragraph|page|line)s?)\b/i.test(prompt),
            hasTone: /\b(formal|informal|professional|casual|friendly|technical|simple|academic)\b/i.test(prompt),
            hasFormat: /\b(list|bullet|markdown|json|table|format|structure)\b/i.test(prompt),
            hasExample: /\b(example|instance|sample|like)\b/i.test(prompt)
        };

        return elements;
    }

    generateSystemRole(taskType) {
        if (taskType === 'general') {
            return 'You are a helpful, knowledgeable, and precise AI assistant.';
        }
        
        const config = this.taskPatterns[taskType];
        return `You are a ${config.role} with deep expertise in ${config.domain}.`;
    }

    improveClarity(prompt) {
        // Remove excessive whitespace
        let improved = prompt.trim().replace(/\s+/g, ' ');
        
        // Capitalize first letter
        improved = improved.charAt(0).toUpperCase() + improved.slice(1);
        
        // Ensure it ends with proper punctuation
        if (!/[.!?]$/.test(improved)) {
            improved += '.';
        }

        return improved;
    }

    addStructure(prompt, taskType, elements) {
        const improvedPrompt = this.improveClarity(prompt);
        const systemRole = this.generateSystemRole(taskType);
        
        let optimized = `# System Role\n${systemRole}\n\n`;
        optimized += `# Task\n${improvedPrompt}\n\n`;
        
        // Add specific instructions based on task type
        optimized += `# Instructions\n`;
        
        switch(taskType) {
            case 'coding':
                optimized += `- Write clean, well-documented code\n`;
                optimized += `- Follow best practices and conventions\n`;
                optimized += `- Include comments explaining key logic\n`;
                optimized += `- Handle edge cases and errors appropriately\n`;
                break;
            case 'writing':
                optimized += `- Write in a clear, engaging style\n`;
                optimized += `- Organize content with proper structure\n`;
                optimized += `- Use appropriate tone and voice\n`;
                optimized += `- Ensure grammatical accuracy\n`;
                break;
            case 'analysis':
                optimized += `- Provide thorough, evidence-based analysis\n`;
                optimized += `- Consider multiple perspectives\n`;
                optimized += `- Support conclusions with reasoning\n`;
                optimized += `- Identify key patterns and insights\n`;
                break;
            case 'explanation':
                optimized += `- Explain concepts clearly and systematically\n`;
                optimized += `- Use analogies where helpful\n`;
                optimized += `- Define technical terms\n`;
                optimized += `- Build from simple to complex\n`;
                break;
            case 'summary':
                optimized += `- Capture all key points\n`;
                optimized += `- Maintain accuracy to source\n`;
                optimized += `- Use concise language\n`;
                optimized += `- Organize information logically\n`;
                break;
            case 'creative':
                optimized += `- Think innovatively and originally\n`;
                optimized += `- Explore diverse possibilities\n`;
                optimized += `- Be bold and imaginative\n`;
                optimized += `- Ensure ideas are practical where needed\n`;
                break;
            default:
                optimized += `- Be clear, accurate, and comprehensive\n`;
                optimized += `- Organize information logically\n`;
                optimized += `- Use appropriate examples\n`;
                optimized += `- Address the core question directly\n`;
        }

        // Add output format section
        optimized += `\n# Output Format\n`;
        
        if (elements.hasFormat) {
            optimized += `- Follow the requested format exactly\n`;
        } else {
            optimized += `- Use clear headings and sections\n`;
            optimized += `- Structure content logically\n`;
        }

        if (elements.hasLength) {
            optimized += `- Adhere to specified length requirements\n`;
        } else {
            optimized += `- Provide comprehensive yet concise output\n`;
        }

        // Add constraints section
        optimized += `\n# Constraints\n`;
        
        if (elements.hasTone) {
            optimized += `- Maintain the specified tone throughout\n`;
        } else {
            optimized += `- Use professional, clear language\n`;
        }
        
        optimized += `- Ensure accuracy and factual correctness\n`;
        optimized += `- Avoid unnecessary jargon unless appropriate\n`;

        // Add example placeholder if helpful
        if (!elements.hasExample && ['coding', 'writing', 'explanation'].includes(taskType)) {
            optimized += `\n# Examples (Optional)\n`;
            optimized += `[If helpful, provide concrete examples to illustrate your response]\n`;
        }

        return optimized;
    }

    optimize(rawPrompt) {
        if (!rawPrompt || rawPrompt.trim().length === 0) {
            throw new Error('Please enter a prompt to optimize');
        }

        if (rawPrompt.trim().length < 5) {
            throw new Error('Prompt is too short. Please provide more details.');
        }

        // Detect task type
        const taskType = this.detectTaskType(rawPrompt);
        
        // Extract key elements
        const elements = this.extractKeyElements(rawPrompt);
        
        // Generate optimized prompt
        const optimizedPrompt = this.addStructure(rawPrompt, taskType, elements);
        
        return {
            optimized: optimizedPrompt,
            taskType: taskType,
            metadata: {
                originalLength: rawPrompt.length,
                optimizedLength: optimizedPrompt.length,
                detectedElements: elements
            }
        };
    }
}

// ===================================
// UI Controller
// ===================================

class UIController {
    constructor() {
        this.optimizer = new PromptOptimizer();
        this.initElements();
        this.initEventListeners();
        this.initTheme();
    }

    initElements() {
        this.rawPromptInput = document.getElementById('rawPrompt');
        this.optimizeBtn = document.getElementById('optimizeBtn');
        this.outputSection = document.getElementById('outputSection');
        this.optimizedPrompt = document.getElementById('optimizedPrompt');
        this.copyBtn = document.getElementById('copyBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.charCount = document.getElementById('charCount');
    }

    initEventListeners() {
        // Optimize button
        this.optimizeBtn.addEventListener('click', () => this.handleOptimize());
        
        // Copy button
        this.copyBtn.addEventListener('click', () => this.handleCopy());
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Character count
        this.rawPromptInput.addEventListener('input', () => this.updateCharCount());
        
        // Enter key support (Ctrl/Cmd + Enter to optimize)
        this.rawPromptInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.handleOptimize();
            }
        });
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    updateCharCount() {
        const length = this.rawPromptInput.value.length;
        this.charCount.textContent = `${length} character${length !== 1 ? 's' : ''}`;
    }

    handleOptimize() {
        const rawPrompt = this.rawPromptInput.value;

        try {
            // Add loading state
            this.optimizeBtn.disabled = true;
            this.optimizeBtn.classList.add('loading');
            this.optimizeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Processing...
            `;

            // Simulate processing time for better UX
            setTimeout(() => {
                const result = this.optimizer.optimize(rawPrompt);
                this.displayOptimizedPrompt(result.optimized);
                
                // Reset button
                this.optimizeBtn.disabled = false;
                this.optimizeBtn.classList.remove('loading');
                this.optimizeBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Optimize Prompt
                `;

                // Show success feedback
                this.showNotification('Prompt optimized successfully!', 'success');
            }, 600);

        } catch (error) {
            this.optimizeBtn.disabled = false;
            this.optimizeBtn.classList.remove('loading');
            this.optimizeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                Optimize Prompt
            `;
            this.showNotification(error.message, 'error');
        }
    }

    displayOptimizedPrompt(optimizedText) {
        this.optimizedPrompt.textContent = optimizedText;
        this.outputSection.classList.add('visible');
        
        // Scroll to output
        this.outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async handleCopy() {
        const text = this.optimizedPrompt.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            this.copyBtn.classList.add('copied');
            this.copyBtn.querySelector('.copy-text').textContent = 'Copied!';
            
            setTimeout(() => {
                this.copyBtn.classList.remove('copied');
                this.copyBtn.querySelector('.copy-text').textContent = 'Copy';
            }, 2000);
            
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.copyBtn.classList.add('copied');
            this.copyBtn.querySelector('.copy-text').textContent = 'Copied!';
            
            setTimeout(() => {
                this.copyBtn.classList.remove('copied');
                this.copyBtn.querySelector('.copy-text').textContent = 'Copy';
            }, 2000);
        } catch (error) {
            this.showNotification('Failed to copy', 'error');
        }
        
        document.body.removeChild(textarea);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ===================================
// Initialize Application
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    new UIController();
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});