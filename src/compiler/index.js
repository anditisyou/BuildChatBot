/**
 * Compiler Pipeline Facade
 * Orchestrates all compilation phases
 */
const Lexer = require('./lexer');
const Parser = require('./parser');
const SemanticAnalyzer = require('./semantic');
const IRGenerator = require('./ir');
const { CompilerError } = require('../errors');

class Compiler {
  static async compile(dsl) {
    try {
      // Phase 1: Lexical Analysis
      const lexer = new Lexer(dsl);
      const tokens = lexer.tokenize();

      // Phase 2: Parsing
      const parser = new Parser(tokens);
      const ast = parser.parse();

      // Phase 3: Semantic Analysis
      const semantic = new SemanticAnalyzer(ast);
      const validatedAST = semantic.analyze();

      // Phase 4: IR Generation
      const irGenerator = new IRGenerator(validatedAST);
      const ir = irGenerator.generate();

      return {
        success: true,
        ir,
        stats: {
          tokens: tokens.length,
          intents: ir.intents.length,
          keywords: ir.runtime.stats.keyword_count
        }
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        phase: error.phase || 'unknown',
        location: error.location || null
      };
    }
  }
}

module.exports = Compiler;