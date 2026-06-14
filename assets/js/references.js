/* =============================================================================
   references.js — the curated bibliography.
   Chapters cite by `key` via <a class="cite" data-ref="vaswani2017"></a>.
   main.js stamps the number + links it to references.html#ref-<n>.
   Ordered chronologically so the References page reads like a timeline.
   ============================================================================= */
window.HANDBOOK = window.HANDBOOK || {};

HANDBOOK.references = [
  { key:"shannon1948", authors:"C. E. Shannon", year:1948,
    title:"A Mathematical Theory of Communication",
    venue:"Bell System Technical Journal",
    url:"https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
    note:"Founded information theory; entropy and the n-gram view of language predictability." },

  { key:"williams1992", authors:"R. J. Williams", year:1992,
    title:"Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning (REINFORCE)",
    venue:"Machine Learning 8(3–4)",
    url:"https://doi.org/10.1007/BF00992696",
    note:"The policy-gradient ancestor of the RL used in RLHF." },

  { key:"bengio2003", authors:"Y. Bengio, R. Ducharme, P. Vincent, C. Jauvin", year:2003,
    title:"A Neural Probabilistic Language Model",
    venue:"JMLR 3",
    url:"https://www.jmlr.org/papers/v3/bengio03a.html",
    note:"First neural language model; introduced learned word embeddings." },

  { key:"mikolov2013", authors:"T. Mikolov, K. Chen, G. Corrado, J. Dean", year:2013,
    title:"Efficient Estimation of Word Representations in Vector Space (word2vec)",
    venue:"arXiv:1301.3781",
    url:"https://arxiv.org/abs/1301.3781",
    note:"Made embeddings practical; 'king − man + woman ≈ queen'." },

  { key:"pennington2014", authors:"J. Pennington, R. Socher, C. Manning", year:2014,
    title:"GloVe: Global Vectors for Word Representation",
    venue:"EMNLP 2014",
    url:"https://aclanthology.org/D14-1162/",
    note:"Co-occurrence-based embeddings; a contemporary of word2vec." },

  { key:"sutskever2014", authors:"I. Sutskever, O. Vinyals, Q. V. Le", year:2014,
    title:"Sequence to Sequence Learning with Neural Networks",
    venue:"NeurIPS 2014 / arXiv:1409.3215",
    url:"https://arxiv.org/abs/1409.3215",
    note:"Encoder–decoder framing that set up machine translation and beyond." },

  { key:"bahdanau2014", authors:"D. Bahdanau, K. Cho, Y. Bengio", year:2014,
    title:"Neural Machine Translation by Jointly Learning to Align and Translate",
    venue:"arXiv:1409.0473",
    url:"https://arxiv.org/abs/1409.0473",
    note:"Introduced the attention mechanism — the seed of the Transformer." },

  { key:"sennrich2016", authors:"R. Sennrich, B. Haddow, A. Birch", year:2016,
    title:"Neural Machine Translation of Rare Words with Subword Units (BPE)",
    venue:"ACL 2016 / arXiv:1508.07909",
    url:"https://arxiv.org/abs/1508.07909",
    note:"Brought Byte-Pair Encoding to NLP — still the basis of modern tokenizers." },

  { key:"vaswani2017", authors:"A. Vaswani, N. Shazeer, N. Parmar, et al.", year:2017,
    title:"Attention Is All You Need",
    venue:"NeurIPS 2017 / arXiv:1706.03762",
    url:"https://arxiv.org/abs/1706.03762",
    note:"THE paper. Introduced the Transformer; replaced recurrence with self-attention." },

  { key:"shazeer2017", authors:"N. Shazeer, A. Mirhoseini, K. Maziarz, et al.", year:2017,
    title:"Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer",
    venue:"arXiv:1701.06538",
    url:"https://arxiv.org/abs/1701.06538",
    note:"Modern Mixture-of-Experts: huge parameter counts, sparse compute." },

  { key:"christiano2017", authors:"P. Christiano, J. Leike, T. Brown, et al.", year:2017,
    title:"Deep Reinforcement Learning from Human Preferences",
    venue:"NeurIPS 2017 / arXiv:1706.03741",
    url:"https://arxiv.org/abs/1706.03741",
    note:"Learning a reward model from human comparisons — the core RLHF idea." },

  { key:"schulman2017", authors:"J. Schulman, F. Wolski, P. Dhariwal, A. Radford, O. Klimov", year:2017,
    title:"Proximal Policy Optimization Algorithms (PPO)",
    venue:"arXiv:1707.06347",
    url:"https://arxiv.org/abs/1707.06347",
    note:"The RL optimizer used to fine-tune models against a reward model." },

  { key:"devlin2018", authors:"J. Devlin, M.-W. Chang, K. Lee, K. Toutanova", year:2018,
    title:"BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    venue:"NAACL 2019 / arXiv:1810.04805",
    url:"https://arxiv.org/abs/1810.04805",
    note:"Encoder-only Transformer; the 'pretrain then fine-tune' template." },

  { key:"radford2018", authors:"A. Radford, K. Narasimhan, T. Salimans, I. Sutskever", year:2018,
    title:"Improving Language Understanding by Generative Pre-Training (GPT-1)",
    venue:"OpenAI",
    url:"https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf",
    note:"The decoder-only, generatively-pretrained line that became GPT." },

  { key:"kudo2018", authors:"T. Kudo, J. Richardson", year:2018,
    title:"SentencePiece: A simple and language independent subword tokenizer",
    venue:"EMNLP 2018 / arXiv:1808.06226",
    url:"https://arxiv.org/abs/1808.06226",
    note:"Language-agnostic tokenization used by Llama, T5, and many others." },

  { key:"radford2019", authors:"A. Radford, J. Wu, R. Child, et al.", year:2019,
    title:"Language Models are Unsupervised Multitask Learners (GPT-2)",
    venue:"OpenAI",
    url:"https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
    note:"Showed scale + plain LM pretraining yields surprising zero-shot ability." },

  { key:"houlsby2019", authors:"N. Houlsby, A. Giurgiu, S. Jastrzebski, et al.", year:2019,
    title:"Parameter-Efficient Transfer Learning for NLP (Adapters)",
    venue:"ICML 2019 / arXiv:1902.00751",
    url:"https://arxiv.org/abs/1902.00751",
    note:"Small inserted modules instead of full fine-tuning — the PEFT idea." },

  { key:"brown2020", authors:"T. Brown, B. Mann, N. Ryder, et al.", year:2020,
    title:"Language Models are Few-Shot Learners (GPT-3)",
    venue:"NeurIPS 2020 / arXiv:2005.14165",
    url:"https://arxiv.org/abs/2005.14165",
    note:"175B parameters; in-context learning made prompting a paradigm." },

  { key:"kaplan2020", authors:"J. Kaplan, S. McCandlish, T. Henighan, et al.", year:2020,
    title:"Scaling Laws for Neural Language Models",
    venue:"arXiv:2001.08361",
    url:"https://arxiv.org/abs/2001.08361",
    note:"Loss falls predictably as a power law in compute, data, and parameters." },

  { key:"lewis2020", authors:"P. Lewis, E. Perez, A. Piktus, et al.", year:2020,
    title:"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (RAG)",
    venue:"NeurIPS 2020 / arXiv:2005.11401",
    url:"https://arxiv.org/abs/2005.11401",
    note:"Coined RAG: retrieve documents, then condition generation on them." },

  { key:"hu2021", authors:"E. J. Hu, Y. Shen, P. Wallis, et al.", year:2021,
    title:"LoRA: Low-Rank Adaptation of Large Language Models",
    venue:"ICLR 2022 / arXiv:2106.09685",
    url:"https://arxiv.org/abs/2106.09685",
    note:"Freeze the model, train tiny low-rank deltas. The workhorse of fine-tuning." },

  { key:"su2021", authors:"J. Su, Y. Lu, S. Pan, et al.", year:2021,
    title:"RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)",
    venue:"arXiv:2104.09864",
    url:"https://arxiv.org/abs/2104.09864",
    note:"Rotary positions; the basis for most long-context extension tricks." },

  { key:"fedus2021", authors:"W. Fedus, B. Zoph, N. Shazeer", year:2021,
    title:"Switch Transformers: Scaling to Trillion Parameter Models",
    venue:"JMLR 2022 / arXiv:2101.03961",
    url:"https://arxiv.org/abs/2101.03961",
    note:"Simplified MoE routing; trillion-parameter sparse models." },

  { key:"hendrycks2021", authors:"D. Hendrycks, C. Burns, S. Basart, et al.", year:2021,
    title:"Measuring Massive Multitask Language Understanding (MMLU)",
    venue:"ICLR 2021 / arXiv:2009.03300",
    url:"https://arxiv.org/abs/2009.03300",
    note:"The 57-subject benchmark that became the default knowledge yardstick." },

  { key:"chen2021", authors:"M. Chen, J. Tworek, H. Jun, et al.", year:2021,
    title:"Evaluating Large Language Models Trained on Code (Codex / HumanEval)",
    venue:"arXiv:2107.03374",
    url:"https://arxiv.org/abs/2107.03374",
    note:"Introduced HumanEval and pass@k for code generation." },

  { key:"hoffmann2022", authors:"J. Hoffmann, S. Borgeaud, A. Mensch, et al.", year:2022,
    title:"Training Compute-Optimal Large Language Models (Chinchilla)",
    venue:"arXiv:2203.15556",
    url:"https://arxiv.org/abs/2203.15556",
    note:"Most models were under-trained; data should scale with parameters." },

  { key:"weicot2022", authors:"J. Wei, X. Wang, D. Schuurmans, et al.", year:2022,
    title:"Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    venue:"NeurIPS 2022 / arXiv:2201.11903",
    url:"https://arxiv.org/abs/2201.11903",
    note:"'Let's think step by step' unlocked reasoning at scale." },

  { key:"wei2022", authors:"J. Wei, Y. Tay, R. Bommasani, et al.", year:2022,
    title:"Emergent Abilities of Large Language Models",
    venue:"TMLR 2022 / arXiv:2206.07682",
    url:"https://arxiv.org/abs/2206.07682",
    note:"Some capabilities appear suddenly past a scale threshold." },

  { key:"ouyang2022", authors:"L. Ouyang, J. Wu, X. Jiang, et al.", year:2022,
    title:"Training Language Models to Follow Instructions with Human Feedback (InstructGPT)",
    venue:"NeurIPS 2022 / arXiv:2203.02155",
    url:"https://arxiv.org/abs/2203.02155",
    note:"The RLHF recipe that made ChatGPT possible: SFT → reward model → PPO." },

  { key:"dettmers2022", authors:"T. Dettmers, M. Lewis, Y. Belkada, L. Zettlemoyer", year:2022,
    title:"LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale",
    venue:"NeurIPS 2022 / arXiv:2208.07339",
    url:"https://arxiv.org/abs/2208.07339",
    note:"8-bit inference without quality loss; the bitsandbytes foundation." },

  { key:"frantar2022", authors:"E. Frantar, S. Ashkboos, T. Hoefler, D. Alistarh", year:2022,
    title:"GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers",
    venue:"ICLR 2023 / arXiv:2210.17323",
    url:"https://arxiv.org/abs/2210.17323",
    note:"One-shot 3–4 bit quantization with little accuracy loss." },

  { key:"dao2022", authors:"T. Dao, D. Y. Fu, S. Ermon, A. Rudra, C. Ré", year:2022,
    title:"FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
    venue:"NeurIPS 2022 / arXiv:2205.14135",
    url:"https://arxiv.org/abs/2205.14135",
    note:"Made attention IO-aware; huge speed/memory wins, exact results." },

  { key:"bai2022", authors:"Y. Bai, S. Kadavath, S. Kundu, et al. (Anthropic)", year:2022,
    title:"Constitutional AI: Harmlessness from AI Feedback",
    venue:"arXiv:2212.08073",
    url:"https://arxiv.org/abs/2212.08073",
    note:"Replace much human feedback with AI feedback guided by principles (RLAIF)." },

  { key:"leviathan2022", authors:"Y. Leviathan, M. Kalman, Y. Matias", year:2022,
    title:"Fast Inference from Transformers via Speculative Decoding",
    venue:"ICML 2023 / arXiv:2211.17192",
    url:"https://arxiv.org/abs/2211.17192",
    note:"Use a small draft model to propose tokens a big model verifies — faster decoding." },

  { key:"touvron2023", authors:"H. Touvron, T. Lavril, G. Izacard, et al. (Meta)", year:2023,
    title:"LLaMA: Open and Efficient Foundation Language Models",
    venue:"arXiv:2302.13971",
    url:"https://arxiv.org/abs/2302.13971",
    note:"Strong open weights that ignited the open-source LLM ecosystem." },

  { key:"rafailov2023", authors:"R. Rafailov, A. Sharma, E. Mitchell, et al.", year:2023,
    title:"Direct Preference Optimization: Your Language Model is Secretly a Reward Model (DPO)",
    venue:"NeurIPS 2023 / arXiv:2305.18290",
    url:"https://arxiv.org/abs/2305.18290",
    note:"Aligns models from preferences with a simple loss — no RL loop or reward model." },

  { key:"dettmers2023", authors:"T. Dettmers, A. Pagnoni, A. Holtzman, L. Zettlemoyer", year:2023,
    title:"QLoRA: Efficient Finetuning of Quantized LLMs",
    venue:"NeurIPS 2023 / arXiv:2305.14314",
    url:"https://arxiv.org/abs/2305.14314",
    note:"4-bit base + LoRA: fine-tune a 65B model on a single 48GB GPU." },

  { key:"lin2023", authors:"J. Lin, J. Tang, H. Tang, et al.", year:2023,
    title:"AWQ: Activation-aware Weight Quantization for LLM Compression",
    venue:"MLSys 2024 / arXiv:2306.00978",
    url:"https://arxiv.org/abs/2306.00978",
    note:"Protect the most salient weights; strong 4-bit quality and speed." },

  { key:"ainslie2023", authors:"J. Ainslie, J. Lee-Thorp, M. de Jong, et al.", year:2023,
    title:"GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints",
    venue:"EMNLP 2023 / arXiv:2305.13245",
    url:"https://arxiv.org/abs/2305.13245",
    note:"Grouped-Query Attention shrinks the KV cache with little quality loss." },

  { key:"kwon2023", authors:"W. Kwon, Z. Li, S. Zhuang, et al.", year:2023,
    title:"Efficient Memory Management for LLM Serving with PagedAttention (vLLM)",
    venue:"SOSP 2023 / arXiv:2309.06180",
    url:"https://arxiv.org/abs/2309.06180",
    note:"Paged KV cache + continuous batching; the engine behind vLLM." },

  { key:"zheng2023", authors:"L. Zheng, W.-L. Chiang, Y. Sheng, et al.", year:2023,
    title:"Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena",
    venue:"NeurIPS 2023 / arXiv:2306.05685",
    url:"https://arxiv.org/abs/2306.05685",
    note:"Validated using strong LLMs (and human votes) as evaluators." },

  { key:"gu2023", authors:"A. Gu, T. Dao", year:2023,
    title:"Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
    venue:"arXiv:2312.00752",
    url:"https://arxiv.org/abs/2312.00752",
    note:"A non-attention sequence model with linear-time scaling in length." },
];

/* number lookups (1-indexed display ids by array order) */
HANDBOOK.refIndexByKey = {};
HANDBOOK.references.forEach(function (r, i) { r.id = i + 1; HANDBOOK.refIndexByKey[r.key] = r; });

HANDBOOK.refHref = function (key) {
  var r = HANDBOOK.refIndexByKey[key];
  if (!r) return "#";
  return HANDBOOK.rootHref("references.html") + "#ref-" + r.id;
};
