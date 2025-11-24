// Thêm vào đầu file game.js
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị layer phủ khi mới vào game
    showStartScreen();
    
    // Xử lý nút bắt đầu
    document.getElementById('startBtn').addEventListener('click', function() {
        hideStartScreen();
    });
    
    // Xử lý nút cốt truyện
    document.getElementById('storyBtn').addEventListener('click', function() {
        showModal('storyModal');
    });
    
    // Xử lý nút luật chơi
    document.getElementById('helpBtn').addEventListener('click', function() {
        showModal('helpModal');
    });
    
    // Xử lý nút đóng modal
    document.querySelectorAll('.close').forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            hideAllModals();
        });
    });
    
    // Đóng modal khi click ra ngoài
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            hideAllModals();
        }
    });
});

function showStartScreen() {
    document.getElementById('startScreen').style.display = 'flex';
}

function hideStartScreen() {
    document.getElementById('startScreen').style.display = 'none';
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideAllModals() {
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.style.display = 'none';
    });
}


// 7 dòng x 9 cột
let ROWS = 7;
let COLS = 9;

let turn = "yellow"; // yellow đi trước
let map = [
    [".",".",".",".",".",".",".",".","."],
    [".",".",".","W","W","W",".",".","."],
    ["TY",".",".","W","W","W",".",".","TR"],
    ["BY","TY",".",".",".",".",".","TR","BR"],
    ["TY",".",".","W","W","W",".",".","TR"],
    [".",".",".","W","W","W",".",".","."],
    [".",".",".",".",".",".",".",".","."]
];
// Ma trận bàn cờ mẫu: 7x9
let board = [
    ["Y6", "", "Y4", "", "", "", "R5", "", "R7"],
    ["", "Y3", "", "", "", "", "", "R8", ""],
    ["", "", "Y2", "", "", "", "R1", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "Y1", "", "", "", "R2", "", ""],
    ["", "Y8", "", "", "", "", "", "R3", ""],
    ["Y7", "", "Y5", "", "", "", "R4", "", "R6"]
];
// Lưu cấp thật khi đi vào chông
let realRank = {};
function getRank(code) {
    if (!code) return -1;
    return parseInt(code.substring(1));
}
function isMine(val) {
    return val && val.startsWith(turn[0].toUpperCase());
}
function resetGame() {
    turn = "yellow";
    realRank = {};
    
    // Reset bàn cờ về trạng thái ban đầu
    board = [
        ["Y6", "", "Y4", "", "", "", "R5", "", "R7"],
        ["", "Y3", "", "", "", "", "", "R8", ""],
        ["", "", "Y2", "", "", "", "R1", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "Y1", "", "", "", "R2", "", ""],
        ["", "Y8", "", "", "", "", "", "R3", ""],
        ["Y7", "", "Y5", "", "", "", "R4", "", "R6"]
    ];
    
    renderBoard();
}
// Render bàn cờ
function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    // Thêm sông
    let river1 = document.createElement("div");
    river1.classList.add("water-group");
    river1.style.top = (1 * 70) + "px";
    river1.style.left = (3 * 70) + "px";
    boardDiv.appendChild(river1);
    
    let river = document.createElement("div");
    river.classList.add("water-group");
    river.style.top = (4 * 70) + "px";
    river.style.left = (3 * 70) + "px";
    boardDiv.appendChild(river);
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.r = r;
            cell.dataset.c = c;

            if (map[r][c] === "TY") cell.classList.add("trap");
            if (map[r][c] === "BY") cell.classList.add("base");
            if (map[r][c] === "TR") cell.classList.add("trapred");
            if (map[r][c] === "BR") cell.classList.add("basered");

            let val = board[r][c];

            if (val) {
                let piece = document.createElement("div");
                piece.classList.add("piece");

                let team = val[0];
                let rank = val.substring(1);
                let key = r + "," + c;
                
                // Xác định rank để hiển thị
                let displayRank = (realRank[key] !== undefined) ? realRank[key] : rank;
                piece.style.backgroundImage = `url("assets/${team}${displayRank}.png")`;
                
                // Thêm hiệu ứng nếu đang trong bẫy
                if (realRank[key] !== undefined) {
                    piece.classList.add("trapped");
                }

                cell.appendChild(piece);
            }

            cell.addEventListener("click", onCellClick);
            boardDiv.appendChild(cell);
        }
    }
}


let selected = null;

function onCellClick(e) {
    let r = parseInt(e.currentTarget.dataset.r);
    let c = parseInt(e.currentTarget.dataset.c);
    let val = board[r][c];

    if (!selected) {
        if (isMine(val)) {
            selected = { r, c };
            highlightMoves(r, c);
        }
        return;
    }

    tryMove(selected.r, selected.c, r, c);
}

function tryMove(sr, sc, r, c) {
    let piece = board[sr][sc];
    let rank = getRank(piece);

    // Đi vào căn cứ đối thủ
    if (map[r][c] === "B") {
        alert(turn.toUpperCase() + " THẮNG!");
        resetGame();
        return;
    }

    // Kiểm tra sông
    if (map[r][c] === "W") {
        if (!piece.startsWith("Y") && !piece.startsWith("R")) return;
        
        if (rank !== 1) {
            clearHighlight();
            selected = null;
            return; // chỉ cọc gỗ đi trên sông
        }
    }

    // Logic bắn qua sông
    if (map[r][c] === "W" && rank !== 1) return;

    let dr = Math.abs(sr - r);
    let dc = Math.abs(sc - c);

    // Nếu quân là Cung hoặc Tên lửa (giả sử rank >=6)
    if (rank == 4 || rank == 7) {
        // Nếu có sông nằm giữa → phóng
        if (sr === r) {
            let minC = Math.min(sc, c);
            let maxC = Math.max(sc, c);
            for (let x = minC + 1; x < maxC; x++) {
                if (map[r][x] === "W") {
                    // Không được phóng vào ô có cọc gỗ
                    for (let checkX = minC + 1; checkX < maxC; checkX++) {
                    if (board[r][checkX] && getRank(board[r][checkX]) === 1) {
                        return; // Có cọc gỗ chắn đường → không được phóng
                    }
                }

                    return performMove(sr, sc, r, c);
                }
            }
        }

        if (sc === c) {
            let minR = Math.min(sr, r);
            let maxR = Math.max(sr, r);
            for (let y = minR + 1; y < maxR; y++) {
                if (map[y][c] === "W") {
                    if (board[r][c] && getRank(board[r][c]) === 1) return;
                    return performMove(sr, sc, r, c);
                }
            }
        }
    }

    // Di chuyển bình thường: 1 ô
    if (dr + dc === 1) {
        return performMove(sr, sc, r, c);
    }

    clearHighlight();
    selected = null;
}

function performMove(sr, sc, r, c) {
    let piece = board[sr][sc];
    let target = board[r][c];

    let attackerColor = piece[0]; // "Y" hoặc "R"
    let attackerRank = getRank(piece);
    let defenderRank = getRank(target);

    // ===============================
    // 1. LUẬT ĂN QUÂN
    // ===============================
    if (target) {
        if (isMine(target)) {
            clearHighlight();
            selected = null;
            return;
        }

        // Xử lý rank thực sự nếu quân tấn công đang trong bẫy
        let oldKey = sr + "," + sc;
        let actualAttackerRank = attackerRank;
        if (realRank[oldKey] !== undefined) {
            actualAttackerRank = realRank[oldKey]; // Lấy rank thực khi đang trong bẫy
        }

        // Xử lý rank thực sự nếu quân phòng thủ đang trong bẫy  
        let actualDefenderRank = defenderRank;
        let targetKey = r + "," + c;
        if (realRank[targetKey] !== undefined) {
            actualDefenderRank = realRank[targetKey]; // Lấy rank thực khi đang trong bẫy
        }

        // QUY TẮC MỚI: Nếu quân phòng thủ đang trong bẫy → LUÔN ĂN ĐƯỢC
        if (realRank[targetKey] !== undefined) {
            // Quân phòng thủ đang trong bẫy, bất kỳ quân nào cũng ăn được
            board[r][c] = piece; // Giữ nguyên quân tấn công
            board[sr][sc] = "";
            delete realRank[targetKey]; // Xóa realRank của quân bị ăn
        }
        // So sánh rank bình thường nếu không có bẫy
        else if (actualAttackerRank > actualDefenderRank) {
            board[r][c] = piece; // Giữ nguyên quân tấn công
            board[sr][sc] = "";
        }
        else if (actualAttackerRank < actualDefenderRank) {
            clearHighlight();
            selected = null;
            return;
        }
        else {
            // bằng nhau → cả hai chết
            board[r][c] = "";
            board[sr][sc] = "";
            // Xóa realRank của cả hai
            delete realRank[oldKey];
            delete realRank[targetKey];
            clearHighlight();
            selected = null;
            turn = turn === "yellow" ? "red" : "yellow";
            renderBoard();
            return;
        }
    }
    else {
        board[r][c] = piece;
        board[sr][sc] = "";
    }

    // ===============================
    // 2. XỬ LÝ RA KHỎI BẪY (TRẢ LEVEL)
    // ===============================
    let oldKey = sr + "," + sc;
    if (realRank[oldKey] !== undefined) {
        let original = realRank[oldKey];
        board[r][c] = attackerColor + original;
        delete realRank[oldKey];
        piece = board[r][c];
    }

    // ===============================
    // 3. XỬ LÝ VÀO BẪY ĐỐI THỦ
    // ===============================
    if (map[r][c] === "T") {
        let isYellow = attackerColor === "Y";

        // trap của Red nằm bên RED side (em tùy chỉnh theo map thực)
        let trapBelongsToRed = (c > 3);
        let trapBelongsToYellow = (c < 3);

        let fallIntoTrap =
            (isYellow && trapBelongsToRed) ||
            (!isYellow && trapBelongsToYellow);

        if (fallIntoTrap) {
            let key = r + "," + c;
            realRank[key] = getRank(board[r][c]);   // lưu rank thật
            board[r][c] = attackerColor + "0"; // hạ cấp
        }
    }

    // ===============================
    // HOÀN TẤT
    // ===============================
    clearHighlight();
    selected = null;

    turn = turn === "yellow" ? "red" : "yellow";
    renderBoard();
}




function highlightMoves(r, c) {
    clearHighlight();

    let piece = board[r][c];
    let rank = getRank(piece);
    
    // Các hướng di chuyển cơ bản
    let dirs = [
        [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    // Highlight các ô di chuyển thông thường (1 ô)
    dirs.forEach(d => {
        let nr = r + d[0];
        let nc = c + d[1];

        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            // Kiểm tra có thể di chuyển đến ô này không
            if (canMoveTo(r, c, nr, nc)) {
                let cell = document.querySelector(`.cell[data-r="${nr}"][data-c="${nc}"]`);
                cell.classList.add("highlight");
            }
        }
    });

    // Nếu là cung (rank 4 hoặc 7) - xử lý bắn qua sông
    if (rank === 4 || rank === 7) {
        highlightBowMoves(r, c);
    }
}

function highlightBowMoves(r, c) {
    let directions = [
        { dr: 0, dc: -1 }, // trái
        { dr: 0, dc: 1 },  // phải
        { dr: -1, dc: 0 }, // trên
        { dr: 1, dc: 0 }   // dưới
    ];

    directions.forEach(dir => {
        let foundRiver = false;
        
        for (let step = 1; step < Math.max(ROWS, COLS); step++) {
            let nr = r + dir.dr * step;
            let nc = c + dir.dc * step;
            
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
            
            // Kiểm tra cọc gỗ CHẮN ĐƯỜNG (chỉ khi chưa đến vị trí đích)
            if (foundRiver && board[nr][nc] && getRank(board[nr][nc]) === 1) {
                // Nếu đây là ô ĐẦU TIÊN sau sông → được phép (vì là vị trí đích)
                // Nếu không phải ô đầu tiên → bị chặn
                let isFirstAfterRiver = true;
                for (let checkStep = 1; checkStep < step; checkStep++) {
                    let checkR = r + dir.dr * checkStep;
                    let checkC = c + dir.dc * checkStep;
                    if (map[checkR][checkC] !== "W" && checkR !== nr && checkC !== nc) {
                        isFirstAfterRiver = false;
                        break;
                    }
                }
                
                if (!isFirstAfterRiver) {
                    break; // bị chặn giữa đường
                }
            }
            
            if (map[nr][nc] === "W") {
                foundRiver = true;
                continue;
            }
            
            // Nếu đã qua sông
            if (foundRiver) {
                // CHỈ highlight nếu có thể ăn quân ở vị trí đích
                if (canAttack(r, c, nr, nc)) {
                    let cell = document.querySelector(`.cell[data-r="${nr}"][data-c="${nc}"]`);
                    cell.classList.add("highlight");
                }
                break; // chỉ highlight ô đầu tiên sau sông
            }
            
            // Nếu chưa qua sông và gặp quân cờ khác thì dừng
            if (!foundRiver && board[nr][nc]) {
                break;
            }
        }
    });
}

function canAttack(sr, sc, dr, dc) {
    let piece = board[sr][sc];
    let target = board[dr][dc];
    
    // Nếu ô đích trống thì không thể tấn công
    if (!target) return false;
    
    // Không thể tấn công quân cùng màu
    if (isMine(target)) return false;
    
    let attackerColor = piece[0];
    let attackerRank = getRank(piece);
    let defenderRank = getRank(target);
    
    // Xử lý rank thực sự nếu quân tấn công đang trong bẫy
    let attackerKey = sr + "," + sc;
    let actualAttackerRank = attackerRank;
    if (realRank[attackerKey] !== undefined) {
        actualAttackerRank = realRank[attackerKey];
    }
    
    // Xử lý rank thực sự nếu quân phòng thủ đang trong bẫy  
    let defenderKey = dr + "," + dc;
    let actualDefenderRank = defenderRank;
    if (realRank[defenderKey] !== undefined) {
        actualDefenderRank = realRank[defenderKey];
    }
    
    // QUY TẮC: Nếu quân phòng thủ đang trong bẫy → LUÔN ĂN ĐƯỢC
    if (realRank[defenderKey] !== undefined) {
        return true;
    }
    
    // So sánh rank bình thường
    return actualAttackerRank > actualDefenderRank;
}

function canMoveTo(sr, sc, dr, dc) {
    let piece = board[sr][sc];
    let target = board[dr][dc];
    
    // Không thể di chuyển đến ô có quân cùng màu
    if (target && isMine(target)) {
        return false;
    }
    
    // Nếu có quân địch ở ô đích, kiểm tra có thể ăn không
    if (target && !isMine(target)) {
        return canAttack(sr, sc, dr, dc);
    }
    
    // Kiểm tra sông - chỉ cọc gỗ (rank 1) đi được
    if (map[dr][dc] === "W") {
        if (getRank(piece) !== 1) {
            return false;
        }
    }
    
    // Kiểm tra bẫy đối thủ - vẫn có thể di chuyển vào
    if (map[dr][dc] === "T") {
        let attackerColor = piece[0];
        let isYellow = attackerColor === "Y";
        let trapBelongsToRed = (dc > 3);
        let trapBelongsToYellow = (dc < 3);
        
        let fallIntoTrap = (isYellow && trapBelongsToRed) || (!isYellow && trapBelongsToYellow);
        if (fallIntoTrap) {
            // Vẫn có thể di chuyển vào bẫy đối thủ
            return true;
        }
    }
    
    return true;
}

function clearHighlight() {
    document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
}

renderBoard();
