async function getBotInfo(req, res) {
  try {
    const repository = req.app.get('botRepository');
    const { botId } = req.params;

    const bot = await repository.findById(botId);

    if (!bot) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found'
      });
    }

    res.json({
      success: true,
      bot: {
        id: bot.bot_id,
        name: bot.bot_name || "Unnamed Bot",
        metadata: bot.metadata || {},
        welcome: bot.welcome || "",
        fallback: bot.fallback || ""
      }
    });

  } catch (error) {
    console.error("🔥 BOT INFO ERROR:", error); // IMPORTANT
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function getAllBots(req, res) {
  try {
    const repository = req.app.get('botRepository');
    const userId = req.query.userId; // Optional filter

    let bots;
    if (userId) {
      bots = await repository.findByUser(userId);
    } else {
      // For now, return all bots (in production, you might want to paginate)
      // This is a simplified version - in real app, you'd have proper pagination
      bots = await repository.findByUser(null); // This might need adjustment
    }

    res.json({
      success: true,
      bots: bots.map(bot => ({
        id: bot.bot_id,
        name: bot.bot_name,
        metadata: bot.metadata,
        created_at: bot.created_at
      }))
    });

  } catch (error) {
    console.error("🔥 GET BOTS ERROR:", error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function deleteBot(req, res) {
  try {
    const repository = req.app.get('botRepository');
    const { botId } = req.params;

    // Check if bot exists
    const bot = await repository.findById(botId);
    if (!bot) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found'
      });
    }

    // Delete the bot
    const deleted = await repository.delete(botId);
    if (deleted) {
      res.json({
        success: true,
        message: 'Bot deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete bot'
      });
    }

  } catch (error) {
    console.error("🔥 DELETE BOT ERROR:", error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

module.exports = { getBotInfo, getAllBots, deleteBot };