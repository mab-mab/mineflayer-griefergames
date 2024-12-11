module.exports = {
    chatPatterns: {
        success: /^\[Orbs\] Du hast erfolgreich ([\d\.,]+) \S+ für ([\d\.,]+) Orbs verkauft\.$/,
    },
    windowPatterns: {
        orbsMenu: /^Händler$/
    },
    npc: {
        identifier: 'Händler',
        position: [172, 25, -42],
        world: 'orbs',
        onInteract: 'windowOpen:orbs->orbsMenu',
    }
}