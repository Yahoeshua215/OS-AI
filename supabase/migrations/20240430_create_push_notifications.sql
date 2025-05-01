-- Create a table for storing push notification templates
CREATE TABLE IF NOT EXISTS push_notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for storing generated push notifications
CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  ctr DECIMAL(5,2),
  template_id UUID REFERENCES push_notification_templates(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some example push notification templates
INSERT INTO push_notification_templates (title, body, category, tags)
VALUES 
  ('Limited Time Offer', 'Don''t miss out on our exclusive deal! Only available for the next 24 hours.', 'promotion', ARRAY['urgent', 'limited-time']),
  ('New Product Alert', 'We just launched our newest product. Be the first to check it out!', 'product', ARRAY['new-release', 'product']),
  ('Abandoned Cart Reminder', 'You left items in your cart. Complete your purchase before they sell out!', 'cart', ARRAY['reminder', 'cart']),
  ('Order Status Update', 'Your order has shipped and is on its way to you!', 'order', ARRAY['update', 'shipping']),
  ('Content Update', 'New content is available for you to enjoy. Check it out now!', 'content', ARRAY['update', 'content']),
  ('Event Reminder', 'Your event is starting in 1 hour. Don''t forget to join!', 'event', ARRAY['reminder', 'event']),
  ('Account Security', 'We noticed a login from a new device. Was this you?', 'security', ARRAY['alert', 'security']),
  ('Subscription Renewal', 'Your subscription is about to expire. Renew now to avoid interruption.', 'billing', ARRAY['reminder', 'subscription']),
  ('Milestone Achievement', 'Congratulations! You''ve reached a new milestone in your journey.', 'achievement', ARRAY['celebration', 'milestone']),
  ('Feedback Request', 'We value your opinion. Please take a moment to share your feedback.', 'feedback', ARRAY['survey', 'feedback']);
