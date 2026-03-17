export type DeliveryStatus = 'pending' | 'success' | 'failed';

export interface DeliveryAttempt {
  id:            string;
  jobId:         string;
  subscriberId:  string;
  status:        DeliveryStatus;
  statusCode:    number | null;
  responseBody:  string | null;
  error:         string | null;
  attemptNumber: number;
  nextRetryAt:   Date | null;
  deliveredAt:   Date | null;
  createdAt:     Date;
}