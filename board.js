// board.js
class GameBoard {
    constructor() {
        this.size = 8;
        this.cells = [];
        this.specialZones = {
            // Vùng 1 - Màu vàng (theo hình)
            zone1: [
                [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [0,7],  // Hàng 1
                [1,0], [1,7],                                              // Hàng 2
                [2,0], [2,7],                                              // Hàng 3  
                [3,0], [3,7]                                               // Hàng 4
            ],
            
            // Vùng 2 - Màu xanh lá (theo hình)
            zone2: [
                [4,0], [4,7],                                              // Hàng 5
                [5,0], [5,7],                                              // Hàng 6
                [6,0], [6,7],                                              // Hàng 7
                [7,0], [7,1], [7,2], [7,3], [7,4], [7,5], [7,6], [7,7]   // Hàng 8
            ],
            
            // Vùng 3 - Màu xanh dương (theo hình)
            zone3: [
                [1,3], [1,4],  // Hàng 2
                [6,3], [6,4]   // Hàng 7
            ],
            
            // Sông Bạch Đằng - Màu xanh nhạt
            river: [
                [2,1], [2,2], [2,3], [2,4], [2,5], [2,6],  // Hàng 3
                [3,1], [3,2], [3,3], [3,4], [3,5], [3,6],  // Hàng 4  
                [4,1], [4,2], [4,3], [4,4], [4,5], [4,6],  // Hàng 5
                [5,1], [5,2], [5,3], [5,4], [5,5], [5,6]   // Hàng 6
            ],
            
            // Bẫy tre (Chọng Tre)
            traps: [
                [1,1], [1,6],  // Hàng 2
                [6,1], [6,6]   // Hàng 7
            ],
            
            // Phòng tuyến (chiến thắng)
            frontline1: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]], // Player 1 vào đây thắng
            frontline2: [[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7]], // Player 2 vào đây thắng
            
            // Vùng câu hỏi lịch sử (cồn lau)
            history: [
                [1,3], [1,4],  // Hàng 2
                [6,3], [6,4]   // Hàng 7
            ]
        };
        this.initBoard();
    }
    isInZone(x, y, zoneName) {
        return this.specialZones[zoneName].some(([zx, zy]) => zx === x && zy === y);
    }
    getZoneType(x, y) {
        if (this.isInZone(x, y, 'zone1')) return 'zone-1';
        if (this.isInZone(x, y, 'zone2')) return 'zone-2'; 
        if (this.isInZone(x, y, 'zone3')) return 'zone-3';
        if (this.isInZone(x, y, 'river')) return 'river';
        return '';
    }
    initBoard() {
        // Khởi tạo bàn cờ
        for (let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.cells[i][j] = null;
            }
        }
    }

    isValidMove(fromX, fromY, toX, toY, piece) {
        const dx = Math.abs(toX - fromX);
        const dy = Math.abs(toY - fromY);
        
        if (dx + dy !== 1) return false;
        
        // Kiểm tra sông Bạch Đằng
        if (this.isInZone(toX, toY, 'river') && piece.type !== 'Cọc gỗ') {
            return false;
        }
        
        return true;
    }

    isRiver(x, y) {
        return this.specialZones.river.some(([rx, ry]) => rx === x && ry === y);
    }

    isTrap(x, y) {
        return this.isInZone(x, y, 'traps');
    }

    isFrontline(x, y, player) {
        const frontline = player === 1 ? this.specialZones.frontline2 : this.specialZones.frontline1;
        return frontline.some(([fx, fy]) => fx === x && fy === y);
    }
    isHistoryZone(x, y) {
        return this.isInZone(x, y, 'history');
    }
}