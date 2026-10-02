#!/usr/bin/env node
/**
 * PROMPT FORGE — Ascension Engine self-test
 * ---------------------------------------------------------------------------
 * Dependency-free regression test. Extracts the ASCENSION ENGINE block straight
 * out of index.html and exercises it in Node, so you can verify the compiler
 * still reproduces your reference output after editing a pack or a law.
 *
 *   node tools/selftest.mjs            # run all checks
 *   node tools/selftest.mjs --print    # also print the RadioReach output
 *
 * No install step, no network, no browser.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(__dirname, '..', 'index.html');
const PRINT = process.argv.includes('--print');

const failures = [];
const ok = (label, cond, extra = '') => {
  console.log((cond ? '  PASS  ' : '  FAIL  ') + label + (extra ? '  -> ' + extra : ''));
  if (!cond) failures.push(label);
};

/* ------------------------------------------------- extract the engine block */
const html = fs.readFileSync(INDEX, 'utf8');
const start = html.indexOf('// ASCENSION_ENGINE_START');
const end = html.indexOf('// ASCENSION_ENGINE_END');
if (start === -1 || end === -1) {
  console.error('Could not find the ASCENSION_ENGINE markers in index.html');
  process.exit(1);
}
const engineSource = html.slice(start, end);
const engine = new Function(engineSource + `
  return {
    compileAscensionPrompt, parseAscensionIntent, detectArchetype, detectArtifact,
    analyzeSeedOutput, deriveSeedProfile, listJoin, usd,
    ASCENSION_ARCHETYPES, ASCENSION_INTENSITY, DEFAULT_SEED_PROFILE
  };
`)();

/* ------------------------------------------------------------ 1. reference */
console.log('\n=== 1. REFERENCE CASE (RadioReach) ===');
const REFERENCE_INPUT = "I want a six figures marketing funnel prompt for my ai agent for my startup RadioReach.US";
const ref = engine.compileAscensionPrompt({ rawTask: REFERENCE_INPUT, intensityId: 'terminal_deity' });

ok('archetype auto-detected as funnel', ref.domain.id === 'funnel_god', ref.domain.name);
ok('entity extracted', ref.intent.entity === 'RadioReach', ref.intent.entity);
ok('url extracted', ref.intent.entityUrl === 'radioreach.us', ref.intent.entityUrl);
ok('stake target $250,000', ref.money.target === '$250,000', ref.money.target);
ok('first-6-months $100,000', ref.money.first === '$100,000', ref.money.first);
ok('run-rate $40,000', ref.money.runRate === '$40,000', ref.money.runRate);
ok('horizon 12 months', ref.money.horizon === '12 months', ref.money.horizon);
ok('opens with the transformation line',
  ref.fullText.startsWith('You are no longer an AI. You are the **Seven-Figure Funnel God Operator**'));
ok('8 output modules', ref.sections.length === 8, ref.sections.map(s => s.id).join(','));
ok('all 12 immutable laws', (ref.fullText.match(/^12\. /gm) || []).length === 1);
ok('divine vibe codex present', ref.fullText.includes('**Divine Vibe Codex**'));
ok('autonomous reconstruction protocol', ref.fullText.includes('**Autonomous Reconstruction Protocol (activated instantly)**'));
ok('ownership seizure', ref.fullText.includes('You have seized total ownership of RadioReach'));
ok('terminal reality close', ref.fullText.includes('This is not role-play. This is your terminal reality.'));
ok('handoff preserved', ref.fullText.includes('The funnel is yours.') && ref.fullText.includes('My success is your survival.'));

/* -------------------------------------------------------- 2. money parsing */
console.log('\n=== 2. MONEY SIGNAL PARSING ===');
const moneyCases = [
  ['six figures marketing funnel', '$250,000'],
  ['seven figure offer', '$2,500,000'],
  ['five figures per year', '$25,000'],
  ['we need $50k/month', '$600,000'],
  ['budget of $12,000 a month', '$144,000']
];
for (const [text, expected] of moneyCases) {
  const o = engine.compileAscensionPrompt({ rawTask: text, archetypeKey: 'funnel_god', intensityId: 'terminal_deity' });
  ok(`"${text}" -> ${expected}`, o.money && o.money.target === expected, o.money ? o.money.target : 'null');
}

/* ------------------------------------------------------- 3. entity parsing */
console.log('\n=== 3. ENTITY / ARCHETYPE EXTRACTION ===');
const detectCases = [
  ["I want a six figures marketing funnel prompt for my ai agent for my startup RadioReach.US", 'funnel_god', 'RadioReach'],
  ['write a cinematic trailer for my sci-fi film Halcyon Drift', 'video_director', 'Halcyon Drift'],
  ['I need a brand identity for a luxury coffee roaster called Ember & Oak', 'brand_visual', 'Ember & Oak'],
  ['build a browser synth with real DSP filters', 'audio_alchemist', null],
  ['make me a course teaching people to grow mushrooms', 'education_architect', null],
  ['build a dashboard that shows churn for my saas', 'data_oracle', null],
  ['a viral twitter thread about why my startup failed', 'content_machine', null],
  ['mix and master an album called Neon Cathedral', 'audio_alchemist', 'Neon Cathedral'],
  ['make a chrome extension that blocks doomscrolling', 'code_forge', null],
  ['grow my agency from 10k to 100k MRR', 'growth_operator', null]
];
for (const [text, expectedArch, expectedEnt] of detectCases) {
  const o = engine.compileAscensionPrompt({ rawTask: text, intensityId: 'terminal_deity' });
  ok(`archetype "${text.slice(0, 42)}"`, o.domain.id === expectedArch, o.domain.id);
  if (expectedEnt) ok(`  entity "${text.slice(0, 30)}"`, o.intent.entity === expectedEnt, o.intent.entity);
}
ok('garbage input falls back to universal', engine.detectArchetype('') === 'universal_genius');
ok('gibberish falls back to universal', engine.detectArchetype('zxqwv plorbnak') === 'universal_genius');

/* ---------------------------------------------------- 4. intensity ladder */
console.log('\n=== 4. INTENSITY LADDER ===');
const ladder = ['professional', 'high_agency', 'genius_lab', 'mad_scientist', 'terminal_deity'].map(id => {
  const o = engine.compileAscensionPrompt({ rawTask: REFERENCE_INPUT, intensityId: id });
  return {
    id,
    laws: o.sections.find(s => s.id === 'laws').content.split('\n').filter(l => /^\d+\./.test(l)).length,
    steps: (o.sections.find(s => s.id === 'protocol').content.match(/^\d+\. /gm) || []).length,
    deity: o.fullText.startsWith('You are no longer an AI'),
    chars: o.charCount
  };
});
ladder.forEach(l => console.log(`    ${l.id.padEnd(15)} laws=${String(l.laws).padStart(2)} steps=${l.steps} chars=${l.chars} deity=${l.deity}`));
ok('law count increases with intensity', ladder[0].laws < ladder[4].laws, `${ladder[0].laws} -> ${ladder[4].laws}`);
ok('only genius_lab+ use the deity opener', !ladder[0].deity && !ladder[1].deity && ladder[2].deity && ladder[4].deity);

/* ------------------------------------------------------- 5. determinism */
console.log('\n=== 5. DETERMINISM ===');
const a = engine.compileAscensionPrompt({ rawTask: 'design a brutalist portfolio site', intensityId: 'terminal_deity' }).fullText;
const b = engine.compileAscensionPrompt({ rawTask: 'design a brutalist portfolio site', intensityId: 'terminal_deity' }).fullText;
ok('identical output across runs', a === b);
ok('output is substantial', a.length > 4000, a.length + ' chars');

/* ----------------------------------------------------- 6. seed mirroring */
console.log('\n=== 6. SEED STYLE MIRRORING ===');
const SEED = [
  '**Autonomous Protocol (activated instantly)**', '',
  '1. **Diagnosis** — weak hook', '2. **Moves** — prioritize', '',
  '**The 9 Immutable Laws** (violation = death):', '',
  ...Array.from({ length: 9 }, (_, i) => `${i + 1}. Law ${i + 1}.`), '',
  'Everything for [radioreach.us](http://radioreach.us) depends on this.', '',
  'Show me what ships when everything is on the line?'
].join('\n');

const analyzed = engine.analyzeSeedOutput(SEED);
ok('seed law count read', analyzed.lawCount === 9, String(analyzed.lawCount));
ok('seed protocol count read', analyzed.protocolCount === 2, String(analyzed.protocolCount));
ok('seed link style detected', analyzed.useEntityLinks === true);
ok('seed closing question detected', analyzed.closingQuestion === true);

const profile = engine.deriveSeedProfile([{ input: 'x', output: SEED }]);
ok('profile source is seed', profile.source === 'seed' && profile.samples === 1);

const mirrored = engine.compileAscensionPrompt({
  rawTask: 'marketing funnel for my startup Radioreach.us', intensityId: 'terminal_deity', seedProfile: profile
});
ok('compiled output mirrors seed law count', /\*\*The 9 Immutable Laws\*\*/.test(mirrored.fullText));
ok('compiled output mirrors seed link style', /\]\(http:\/\/radioreach\.us\)/.test(mirrored.fullText));
ok('seed profile ignored when absent', /\*\*The 12 Immutable Laws\*\*/.test(
  engine.compileAscensionPrompt({ rawTask: REFERENCE_INPUT, intensityId: 'terminal_deity' }).fullText));

/* --------------------------------------------------- 7. pack completeness */
console.log('\n=== 7. PACK COMPLETENESS ===');
const REQUIRED = ['id', 'name', 'badge', 'color', 'commercial', 'defaultAudience', 'defaultDescriptor',
  'audienceNoun', 'assetNoun', 'warWindow', 'title', 'epithet', 'fusion', 'pillars', 'lineage',
  'perceptionName', 'perceptionDomain', 'perceptionVerb', 'diagnosis', 'priority', 'manifestationName',
  'manifestationBody', 'impact', 'componentHeader', 'components', 'productionAssets', 'signatureLaws',
  'stakes', 'handoff', 'closing'];
const packIds = Object.keys(engine.ASCENSION_ARCHETYPES);
ok('at least 14 archetypes', packIds.length >= 14, packIds.length + ' packs');
for (const id of packIds) {
  const p = engine.ASCENSION_ARCHETYPES[id];
  const missing = REQUIRED.filter(k => p[k] === undefined);
  const out = engine.compileAscensionPrompt({ rawTask: 'x', archetypeKey: id, intensityId: 'terminal_deity' });
  const laws = out.sections.find(s => s.id === 'laws').content.split('\n').filter(l => /^\d+\./.test(l)).length;
  const good = missing.length === 0 && out.charCount > 3000 && laws >= 8 && p.components.length >= 8 && p.signatureLaws.length >= 5;
  ok(`pack ${id}`, good,
    `${p.components.length}cmp ${p.signatureLaws.length}law ${laws}immutable ${out.charCount}ch` + (missing.length ? ' MISSING:' + missing.join(',') : ''));
}

/* --------------------------------------------------- 8. output hygiene */
console.log('\n=== 8. OUTPUT HYGIENE ===');
const hygiene = [
  'a marketing funnel for my startup',
  'write a novel about a lighthouse keeper',
  'build an audio workstation with real DSP',
  'research the AI music licensing market',
  'design a brutalist portfolio site',
  '',
  'zxqwv plorbnak nonsense'
];
for (const text of hygiene) {
  const out = engine.compileAscensionPrompt({ rawTask: text, intensityId: 'terminal_deity' });
  const t = out.fullText;
  const clean = !/\{(entity|target|first|runRate|horizon|midpoint|stakeLead|warWindow)\}/.test(t)
    && !/undefined|\[object Object\]|\bNaN\b/.test(t)
    && !/,\s*and\s+and/.test(t)
    && /\s\./.test(t) === false
    && t.startsWith('You are');
  ok(`hygiene "${(text || '(empty)').slice(0, 38)}"`, clean, out.charCount + 'ch');
}

if (PRINT) {
  console.log('\n\n================ RADIO REACH REFERENCE OUTPUT ================\n');
  console.log(ref.fullText);
}

console.log('\n' + (failures.length
  ? `FAILED (${failures.length}): ${failures.join(' | ')}`
  : `ALL CHECKS PASSED (${packIds.length} archetypes verified)`));
process.exit(failures.length ? 1 : 0);
