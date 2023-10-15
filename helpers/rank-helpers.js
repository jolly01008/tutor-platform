// 幫每筆資料加上index。array參數，即是從rankIndex(allRank)帶進來的陣列資料
// 得到每筆資料都多了rank屬性的"新陣列"，並依序給上順序名次
const rankIndex = array => {
  if (!array || !array.length) return []
  for (let i = 0; i < array.length; i++) {
    array[i].rank = i + 1
  }
  return array
}

// userController得到的userId、allRank參數帶進來
const myRank = (userId, allRank) => {
  const ranks = rankIndex(allRank)

  // "新陣列"內，每筆資料的userId屬性，去比對有沒有與參數userId相符的(就能找出正在使用的使用者)
  // 若有相符，取出該名使用者的rank
  const result = ranks.find(r => r.userId === userId)
  if (result) {
    return result.rank
  } else {
    return null
  }
}

module.exports = {
  rankIndex,
  myRank
}
