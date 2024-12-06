export interface DbCommitment {
  id: string
  user_id: string
  type: string
  flexibility: string
  title: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  start_time: string | null
  end_time: string | null
}

export interface Commitment {
  id: string
  userId: string
  type: string
  flexibility: string
  title: string
  startDate: string
  endDate: string
  startTime: string | null
  endTime: string | null
} 