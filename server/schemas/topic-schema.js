//=============================================================================
//VERY SIMPLE USERNAME AND PASSWORD SCHEMA WITH PASSWORD HASH
//=============================================================================
var mongoose = require( 'mongoose' );
var schema = mongoose.Schema;

var topicSchema = new schema( {
	text:     { type: String, required: true, index: { unique: true } },
	html:     { type: String },
	tags:     { type: Array,   required: false },
	hidden:   { type: Boolean, required: true, default: false },
	deltas:   { type: String,  required: true, default: 0 },
	sames:    { type: String,  required: true, default: 0 },
	flags:    { type: String,  required: true, default: 0 },
	date:     { type: Date,    required: true, default: Date.now }
});

var Topic = mongoose.model( 'topic', topicSchema )

//unhidden (tag liberally)
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Does human nature make communism impossible?';
	newTopic.tags     = ['socialism', 'politics', 'economics', 'psychology', 'sociology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it possible to be an anarchist without opposing hierarchy?';
	newTopic.tags     = ['anarchism', 'politics']
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is anarcho-capitalism a type of anarchism?';
	newTopic.tags     = ['anarchism', 'capitalism', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How did capitalism come to be?';
	newTopic.tags     = ['capitalism', 'history', 'economics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Do economic classes exist? If so, what are they?';
	newTopic.tags     = ['economics', 'politics', 'class theory'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Imagine that there is a runaway trolley barreling down a railway. Ahead there are five people tied up and unable to move. The trolley is headed straight for them. You are standing some distance off in the train yard, next to a lever. If you pull this lever, the trolley will switch to a different set of tracks. Unfortunately, there is one person on the side track. You have two options: (1) Do nothing, and the trolley kills the five people on the main track. (2) Pull the lever, diverting the trolley onto the side track where it will kill one person. Which is the correct choice?';
	newTopic.tags     = ['ethics', 'trolley problem'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is software freedom important?';
	newTopic.tags     = ['ethics', 'technology', 'software'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What role is bitcoin likely to play in the future of finance?';
		newTopic.tags     = ['economics', 'technology', 'forecasting', 'cryptocurrency', 'bitcoin', 'money', 'finance'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it reasonable to expect the poor to pick themselves up by their bootstraps?';
	newTopic.tags     = ['economics', 'ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What role are cryptocurrencies likely to play in the future of finance?';
	newTopic.tags     = ['economics', 'technology', 'forecasting', 'cryptocurrency', 'money', 'finance'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should some criminals be put to death?';
	newTopic.tags     = ['ethics', 'politics', 'crime', 'death', 'justice'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is political moderatism generally preferable to radicalism?';
	newTopic.tags     = ['politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Does patriarchy exist?';
	newTopic.tags     = ['politics', 'sociology', 'feminism'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Do animals have rights?';
	newTopic.tags     = ['ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is human sensory information (including science) a reliable means to affirming authoritative truth?';
	newTopic.tags     = ['epistemology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it possible to arrive at any authoritative truth?';
	newTopic.tags     = ['epistemology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are extremist political beliefs necessarily incorrect, unethical, or otherwise undesirable?';
	newTopic.tags     = ['ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Does education need an overhaul? If so, what changes should be made to our educational systems?';
	newTopic.tags     = ['politics', 'education'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Does the prison system need an overhaul? If so, what changes should be made to our prisons?';
	newTopic.tags     = ['politics', 'crime'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it possible to replace every component of an object, and have it remain the same object?';
	newTopic.tags     = ['metaphysics‎'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'If a tree falls in the woods and there is no one there to hear it, does it make a sound?';
	newTopic.tags     = ['epistemology', 'metaphysics‎'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why is there something rather than nothing?';
	newTopic.tags     = ['metaphysics‎'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'For what purpose do people exist?';
	newTopic.tags     = ['metaphysics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is economics a science?';
	newTopic.tags     = ['economics', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are the soft sciences actual sciences?';
	newTopic.tags     = ['science', 'epistemology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Does the universe exist?';
	newTopic.tags     = ['epistemology', 'metaphysics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is free will, and do we have it?';
	newTopic.tags     = ['metaphysics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Do a god or gods exist? If so, what is/are they like?';
	newTopic.tags     = ['epistemology', 'metaphysics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is the ideal moral system?';
	newTopic.tags     = ['ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Can anything really be experienced objectively?';
	newTopic.tags     = ['epistemology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What are numbers?';
	newTopic.tags     = ['metaphysics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is the best way to organize a society?';
	newTopic.tags     = ['sociology', 'economics', 'politics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Do events actually occur if they are not observed?';
	newTopic.tags     = ['metaphysics', 'epistemology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Where were people before they were born?';
	newTopic.tags     = ['metaphysics', 'epistemology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why do we call some belief systems “mythologies” (ancient Greek, Norse, Egyptian, etc.) and others religions?';
	newTopic.tags     = ['sociology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What should be the role of sex in society?';
	newTopic.tags     = ['sociology', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'In what circumstances is it ethical to kill a human being?';
	newTopic.tags     = ['ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is Internet piracy unethical?';
	newTopic.tags     = ['technology', 'ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is Internet piracy bad for the arts?';
	newTopic.tags     = ['technology', 'art', 'economics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is animal testing wrong?';
	newTopic.tags     = ['ethics', 'science', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should higher education be made freely available?';
	newTopic.tags     = ['ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is theft wrong?';
	newTopic.tags     = ['ethics', 'economics', 'crime'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is theft an effective way to create change in society?';
	newTopic.tags     = ['politics', 'sociology', 'crime'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is the best way to acquire news about the world?';
	newTopic.tags     = ['politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Can corporations engage in censorship?';
	newTopic.tags     = ['politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is the difference between a private company and a government?';
	newTopic.tags     = ['politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it possible to have a functioning society without a government?';
	newTopic.tags     = ['politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is there a difference between private and personal property?';
	newTopic.tags     = ['politics', 'economics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is the self?';
	newTopic.tags     = ['metaphysics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it more important that art be technically impressive, or conceptually interesting?';
	newTopic.tags     = ['art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it better to encourage students to read classic literature or contemporary literature?';
	newTopic.tags     = ['art', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is classic literature better than contemporary literature?';
	newTopic.tags     = ['art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is modern art \'real\' art?';
	newTopic.tags     = ['art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is abstract art \'real\' art?';
	newTopic.tags     = ['art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Can art be both high quality and easy to create?';
	newTopic.tags     = ['art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Can games be art?';
	newTopic.tags     = ['art', 'technology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should art be political?';
	newTopic.tags     = ['art', 'politics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should the rabbit in the Trix commercial be allowed to eat Trix cereal? (Despite that they are \'for kids\'.)';
	newTopic.tags     = ['pop culture', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Who is the best Star Trek captain?';
	newTopic.tags     = ['pop culture', 'art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Who is the best Doctor in Doctor Who?';
	newTopic.tags     = ['pop culture', 'art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is death a certainty?';
	newTopic.tags     = ['science', 'technology', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Do you believe that a technological singularity is likely? If so, when do you believe it will occur?';
	newTopic.tags     = ['science', 'technology', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What would extraterrestrial life be like?';
	newTopic.tags     = ['science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What might intelligent extraterrestrial life be like?';
	newTopic.tags     = ['science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Which foods are healthy, and why?';
	newTopic.tags     = ['science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How did the universe come to be?';
	newTopic.tags     = ['science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Could it be possible to move faster than light in a vacuum, or otherwise subvert the \'universal speed limit\'?';
	newTopic.tags     = ['science', 'technology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are genetically modified foods safe?';
	newTopic.tags     = ['science', 'technology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is organic farming preferable to conventional farming?';
	newTopic.tags     = ['science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is cannabis (marijuana) safe to use? Is it healthy?';
	newTopic.tags     = ['science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are psychedelic drugs such as LSD, Psychocybin, and Mescaline safe? Are they healthy?';
	newTopic.tags     = ['science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is open source software higher quality than closed source software?';
	newTopic.tags     = ['technology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'If a large asteroid was headed for earth, would we be able to defend ourselves? If so, what would be the most effective way to do this?';
	newTopic.tags     = ['science', 'technology', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are vaccines dangerous?';
	newTopic.tags     = ['science', 'technology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it worse to fail at something or never attempt it in the first place?';
	newTopic.tags     = ['metaphysics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'In what ways do you think the world will be different in 10 years?';
	newTopic.tags     = ['forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'In what ways do you think the world will be different in 100 years?';
	newTopic.tags     = ['forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'For how long is the United States likely to remain a major world power?';
	newTopic.tags     = ['politics', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'I think, therefore I am. Does this logic hold true?';
	newTopic.tags     = ['metaphysics', 'epistemology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Where do property rights come from?';
	newTopic.tags     = ['politics', 'ethics', 'economics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should the sciences operate according to a universal and fixed set of rules? (e.g., the scientific method)';
	newTopic.tags     = ['epistemology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is science the only way to arrive at truth?';
	newTopic.tags     = ['epistemology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'When will Moore\'s Law end?';
	newTopic.tags     = ['technology', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should organ donation be compulsory?';
	newTopic.tags     = ['ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is utilitarianism correct?';
	newTopic.tags     = ['ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Does deregulation of markets create more harm than good?';
	newTopic.tags     = ['ethics', 'economics', 'capitalism'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Could advanced technology reduce or eliminate the need for or prevalence of economic systems?';
	newTopic.tags     = ['economics', 'technology', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Can capitalism exist without systems of class?';
	newTopic.tags     = ['economics', 'politics', 'capitalism'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is capitalism the most \'efficient\' economic system?';
	newTopic.tags     = ['economics', 'politics', 'capitalism'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are Laissez-Faire Capitalism and free markets the same thing?';
	newTopic.tags     = ['economics', 'capitalism', 'anarchism'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is capitalism ethical?';
	newTopic.tags     = ['economics', 'politics', 'capitalism', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is the difference between socialism and communism?';
	newTopic.tags     = ['economics', 'politics', 'socialism'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Would raising the minimum wage help or hurt the poor?';
	newTopic.tags     = ['economics', 'politics', 'labor'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is a universal basic income or negative income tax feasible/desirable?';
	newTopic.tags     = ['economics', 'politics', 'money', 'tax', 'welfare'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are scientists and engineers paid as much as they should be?';
	newTopic.tags     = ['economics', 'ethics', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should artists make more money than they do?';
	newTopic.tags     = ['economics', 'ethics', 'art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should tipping be a social norm?';
	newTopic.tags     = ['economics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should college courses factor attendance into their grading policy?';
	newTopic.tags     = ['education'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is a college degree an indicator of intelligence?';
	newTopic.tags     = ['education', 'psychology', 'sociology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is a college degree valuable?';
	newTopic.tags     = ['education', 'labor', 'economics', 'value', 'finance'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is a liberal arts style education desirable?';
	newTopic.tags     = ['education'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it preferable to work in the private sector or the public sector?';
	newTopic.tags     = ['labor', 'economics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is technological unemployment something to be worried about? How much impact will it have on our future?';
	newTopic.tags     = ['technology', 'economics', 'labor', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should private prisons exist?';
	newTopic.tags     = ['politics', 'ethics', 'economics', 'crime', 'justice'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are workers generally paid the value of what they produce?';
	newTopic.tags     = ['labor', 'economics', 'value'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is the glorification of athletes a bad thing?';
	newTopic.tags     = ['sociology', 'ethics', 'sports'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Does the practice of digitally editing in advertising and other mediums to make actors appear more attractive than they are have a negative impact on our self-perceptions?';
	newTopic.tags     = ['sociology', 'psychology', 'advertising', 'body image'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Can films be art?';
	newTopic.tags     = ['art', 'film', 'film critique', 'film analysis', 'critique'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is the use of a formula detrimental to storytelling?';
	newTopic.tags     = ['art', 'literature', 'literary studies', 'literary critique', 'critique'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are older films, music, and/or games overrated?';
	newTopic.tags     = ['art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should nudity in television and/or film be censored?';
	newTopic.tags     = ['art', 'politics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should profanity in television, film, radio, and/or music be censored?';
	newTopic.tags     = ['art', 'politics', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Should non-violent criminals receive prison sentences?';
	newTopic.tags     = ['politics', 'crime', 'ethics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is the universe a computer?';
	newTopic.tags     = ['epistemology', 'metaphysics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is the brain a computer?';
	newTopic.tags     = ['epistemology', 'metaphysics', 'artificial intelligence', 'neurology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is mathematical realism correct in its claim that mathematical entities exist independent of the human mind?';
	newTopic.tags     = ['epistemology', 'metaphysics', 'mathematics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How do you explain the Fermi Paradox?';
	newTopic.tags     = ['science', 'cosmology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why do we dream?';
	newTopic.tags     = ['science', 'psychology', 'neurology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is the development of AI ethical?';
	newTopic.tags     = ['technology', 'ethics', 'artificial intelligence'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why does the placebo effect work?';
	newTopic.tags     = ['science', 'psychology', 'medicine'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How does sonoluminescence occur?';
	newTopic.tags     = ['science', 'physics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How would our society deal with a first contact with intelligent extraterrestrial life?';
	newTopic.tags     = ['sociology', 'cosmology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Can any information be known a priori?';
	newTopic.tags     = ['epistemology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why do humans wear clothing?';
	newTopic.tags     = ['sociology', 'psychology', 'neurology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why is pain unpleasant?';
	newTopic.tags     = ['psychology', 'neurology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why are things creepy?';
	newTopic.tags     = ['psychology', 'neurology', 'sociology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why are things cute?';
	newTopic.tags     = ['psychology', 'neurology', 'sociology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why do we laugh?';
	newTopic.tags     = ['psychology', 'neurology', 'sociology', 'science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Why are Let\'s Plays the most popular videos on Youtube?';
	newTopic.tags     = ['psychology', 'sociology', 'art'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'At what point does sound become music?';
	newTopic.tags     = ['psychology', 'art', 'neurology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Do the branches of philosophy have an objective order of importance? E.g., is epistemology inherently more important than aesthetics, or vice versa?';
	newTopic.tags     = ['epistemology', 'metaphilosophy'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How long will humanity last, and what will end it?';
	newTopic.tags     = ['politics', 'technology', 'forecasting'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is the difference between global warming and climate change?';
	newTopic.tags     = ['politics', 'science', 'sociology', 'climate science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is technology dangerous?';
	newTopic.tags     = ['technology', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'What is Scrooge McDuck\'s impact on the economy of Duckburg and the world as a whole?';
	newTopic.tags     = ['pop culture', 'economics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is being a police officer a noble or heroic choice?';
	newTopic.tags     = ['ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is serving in the military a noble or heroic choice?';
	newTopic.tags     = ['ethics', 'politics'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are scientific journals with paywalls harmful to the quality of the sciences?';
	newTopic.tags     = ['science', 'politics', 'philosophy of science'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are scientific journals with paywalls harmful to public scientific literacy?';
	newTopic.tags     = ['science', 'politics', 'philosophy of science', 'education'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is a 100 hour video game ever worth 100 hours of Tolstoy?';
	newTopic.tags     = ['video games', 'game critique', 'video game critique', 'critique', 'games', 'ludology', 'game studies', 'epistemology', 'education'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'A trolley is hurtling down a track towards five people. You are on a bridge under which it will pass, and you can stop it by dropping a heavy weight in front of it. As it happens, there is a very fat man next to you – your only way to stop the trolley is to push him over the bridge and onto the track, killing him to save five. Should you proceed?';
	newTopic.tags     = ['ethics', 'trolley problem', 'hypothetical'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'A trolley is hurtling down a track towards five people. You can divert its path by colliding another trolley into it, but if you do, both will be derailed and go down a hill, and into a yard where a man is sleeping in a hammock. He would be killed. Should you proceed?';
	newTopic.tags     = ['ethics', 'trolley problem', 'hypothetical'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'It is 1933. You are in Berlin, Germany. Somehow, you find yourself in a position where you can effortlessly steal Adolf Hitler\'s wallet. This theft will not effect Hitler\'s rise to power, the nature of World War II, or the Holocaust. There is no important identification in the wallet, but the act will cost Hitler forty Reichsmarks and completely ruin his evening. You do not need the money. The odds that you will be caught committing this crime are less than two percent. Are you ethically obligated to steal Hitler\'s wallet?';
	newTopic.tags     = ['ethics', 'Hitler', 'history', 'hypothetical'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is incommensurability a significant issue for the sciences?';
	newTopic.tags     = ['epistemology', 'metaphysics', 'science', 'philosophy of science' ];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it true that the moment at which you fully understand a film is the moment it loses its \'magic\'?';
	newTopic.tags     = ['art', 'film', 'film critique', 'critique'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it true that the moment at which you fully understand a story is the moment it loses its \'magic\'?';
	newTopic.tags     = ['art', 'critique', 'literature', 'literary critique', 'literary analysis', 'story telling'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it possible to \'solve\' chess?';
	newTopic.tags     = ['games', 'ludology', 'game studies', 'artificial intelligence'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How safe are microwaves?';
	newTopic.tags     = ['health', 'technology', 'cooking'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is Wikipedia a reliable source of information?';
	newTopic.tags     = ['epistemology', 'technology', 'library science', 'Wikipedia'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it reasonable to criminalize Holocaust denial?';
	newTopic.tags     = ['ethics', 'history', 'crime', 'law', 'justice', 'Hitler'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it beneficial to make light of tragedy, or does the harm outweigh the good?';
	newTopic.tags     = ['ethics', 'psychology', 'sociology'];
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Are standardized tests, such as the ACT and SAT, effective at measuring intelligence or academic ability?';
	newTopic.tags     = ['education', 'psychology', 'neurology'];
	newTopic.save();

//hidden (use more conservative tagging)
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'How much of a threat is a 51% attack to cryptocurrencies?';
	newTopic.tags     = ['cryptocurrency', 'bitcoin'];
	newTopic.hidden   = true;
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Is it true that the moment at which you fully understand a game is the moment it loses its \'magic\'?';
	newTopic.tags     = ['video games', 'game critique', 'video game critique', 'games', 'ludology', 'game studies'];
	newTopic.hidden   = true;
	newTopic.save();
var newTopic = new Topic( { text: '' } );
	newTopic.text     = 'Who was more correct, Huxley or Orwell?';
	newTopic.tags     = ['literature', 'literary critique', 'literary analysis'];
	newTopic.save();


module.exports = mongoose.model( 'topic', topicSchema );
