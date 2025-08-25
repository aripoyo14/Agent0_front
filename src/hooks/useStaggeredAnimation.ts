import { useState, useEffect } from 'react';

export function useStaggeredAnimation(isLoading: boolean, delay: number = 100) {
  const [showHeader, setShowHeader] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // ヘッダーを最初に表示
      const headerTimer = setTimeout(() => setShowHeader(true), 0);
      
      // 面談記録を少し遅れて表示
      const meetingsTimer = setTimeout(() => setShowMeetings(true), delay);
      
      // 政策意見をさらに遅れて表示
      const policiesTimer = setTimeout(() => setShowPolicies(true), delay * 2);
      
      // 人脈マップを最後に表示
      const networkTimer = setTimeout(() => setShowNetwork(true), delay * 3);

      return () => {
        clearTimeout(headerTimer);
        clearTimeout(meetingsTimer);
        clearTimeout(policiesTimer);
        clearTimeout(networkTimer);
      };
    } else {
      // ローディング中は全て非表示
      setShowHeader(false);
      setShowMeetings(false);
      setShowPolicies(false);
      setShowNetwork(false);
    }
  }, [isLoading, delay]);

  return {
    showHeader,
    showMeetings,
    showPolicies,
    showNetwork
  };
}
