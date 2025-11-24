// pieces.js
class Piece {
    constructor(type, rank, player) {
        this.type = type;
        this.rank = rank;
        this.player = player;
        this.attackPower = rank;
        this.isInTrap = false;
    }

    canCapture(targetPiece) {
        if (this.isInTrap) return false;
        if (targetPiece.type === 'Cọc gỗ' && this.isOnRiver()) return true;
        return this.rank >= targetPiece.rank;
    }

    isOnRiver() {
        // Logic kiểm tra có đang trên sông không
        return false;
    }
}

const PIECE_TYPES = {
    'Cọc gỗ': 1,
    'Tre Thành Gióng': 2,
    'Nỏ thần Liên Châu': 3,
    'Cung tên Chi Lăng': 4,
    'Khiên': 5,
    'Súng trường Cao Thắng': 6,
    'Tên lửa 1965': 7,
    'Xe tăng T-54B': 8
};