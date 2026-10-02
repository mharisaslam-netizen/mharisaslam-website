import { readFile, stat } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const html=await readFile(join(root,'dist/business-performance/index.html'),'utf8');
assert.equal((html.match(/<h1\b/g)||[]).length,1,'one H1');
assert(html.includes('href="https://www.mharisaslam.com/business-performance"'),'canonical');
assert(html.includes('content="index,follow,'),'indexable');
assert(!/noindex|PRIVATE REVIEW|chatgpt\.site|_layout-review|Live website unchanged/i.test(html),'no private-preview material');
assert(!/available for|consultation|advisory engagement|Vodafone|guaranteed|group-wide financial uplift achieved/i.test(html),'neutral and evidence-grounded copy');
assert(html.includes('Conceptual illustration'),'illustration disclosure');
assert(html.includes('business-performance-hero.webp'),'hero illustration');
assert(html.includes('haris-aslam.webp'),'authentic portrait');
assert((html.match(/href="\/business-performance"/g)||[]).length>=3,'header/mobile/footer integration');
for(const id of ['margin','cash','growth','execution']){
 assert(html.includes(`id="tab-${id}"`),'tab '+id);
 assert(html.includes(`id="panel-${id}"`),'panel '+id);
 assert(html.includes(`aria-controls="panel-${id}"`),'tab target '+id);
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,'unique IDs');
for(const f of ['business-performance.css','business-performance.js','business-performance-hero.webp'])assert((await stat(join(root,'dist/assets',f))).size>0,'asset '+f);
for(const file of ['sitemap.xml','sitemap-priority.xml','llms.txt'])assert((await readFile(join(root,'dist',file),'utf8')).includes('https://www.mharisaslam.com/business-performance'),'discovery '+file);
const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
assert(graph.some(x=>x['@type']==='WebPage'&&x.url==='https://www.mharisaslam.com/business-performance'),'WebPage schema');
assert(graph.some(x=>x['@type']==='Person'&&x['@id']==='https://www.mharisaslam.com/#person'),'shared Person');
assert(!graph.some(x=>['Service','LocalBusiness'].includes(x['@type'])),'no service solicitation schema');
console.log('Business Performance: content, assets, tabs, navigation, canonical, schema and indexability checks passed.');
