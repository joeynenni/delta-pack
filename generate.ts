import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { convertYamlToTypeScript } from './convert';
import { renderDoc } from './codegen';
import type { Type } from './generator';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main().catch(console.error);
 }
 
async function main() {
	const args = process.argv.slice(2);
	if (args.length !== 2) {
	  console.error('Usage: tsx generate.ts <input.ts|yml> <output.ts>');
	  process.exit(1);
	}
 
	const [inputFile, outputFile] = args;
	
	try {
	  const inputPath = path.resolve(process.cwd(), inputFile);
	  let schema: Record<string, Type>;
	  
	  if (inputFile.endsWith('.yml')) {
		 const yamlContent = fs.readFileSync(inputPath, 'utf8');
		 const yamlSchema = yaml.load(yamlContent) as Record<string, Record<string, string> | string[]>;
		 
		 // Generate temporary TypeScript file
		 const tempTs = convertYamlToTypeScript(yamlSchema);
		 const tempDir = path.dirname(inputPath);
		 const tempTsPath = path.join(tempDir, 'schema.temp.ts');
		 
		 try {
			fs.writeFileSync(tempTsPath, tempTs);
			// Import the temporary TypeScript schema
			const schemaModule = await import(`file://${tempTsPath}`);
			schema = schemaModule.default;
		 } finally {
			// Clean up temp files
			fs.unlinkSync(tempTsPath);
		 }
	  } else {
		 const schemaModule = await import(`file://${inputPath}`);
		 schema = schemaModule.default;
	  }
	  
	  if (!schema || typeof schema !== 'object') {
		 throw new Error('Invalid schema format');
	  }
	  
	  const output = renderDoc(schema);
	  fs.writeFileSync(outputFile, output);
	} catch (error) {
	  console.error('Error processing schema:', error);
	  process.exit(1);
	}
 }
