const Compiler = require('../../compiler');

async function compile(req, res) {
  try {
    const repository = req.app.get('botRepository');
    const { dsl } = req.body;

    if (!dsl || typeof dsl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'DSL input required'
      });
    }

    const result = await Compiler.compile(dsl);

    if (!result.success) {
      return res.status(400).json(result);
    }

    const userId = req.userId || "anonymous";

    await repository.save(result.ir.bot_id, userId, result.ir);

    res.json({
      success: true,
      bot_id: result.ir.bot_id,
      stats: result.stats,
      embed_script: `<script src="/widget.js" data-bot-id="${result.ir.bot_id}"></script>`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Compile error' });
  }
}

module.exports = { compile };