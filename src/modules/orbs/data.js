module.exports = {
    chatPatterns: {
        success: /^\[Orbs\] Du hast erfolgreich ([\d\.,]+) \S+ für ([\d\.,]+) Orbs verkauuft\.$/,
    },
    npc: {
        identifier: 'Händler',
        position: [172, 25, -42],
        world: 'orbs',
        onInteract: 'windowOpen:lottery->menu',
    }
}