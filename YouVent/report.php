<?php
// 파이썬에서 보낸 데이터 받기
$event_link = $_GET['event_link'] ?? '링크 없음';
$event_content = $_GET['event_content'] ?? '내용 없음';

// 받은 데이터를 "events.txt" 파일에 추가로 기록하기
$file = 'events.txt';
$data_to_save = "링크: " . $event_link . "\n" . "내용: " . $event_content . "\n-----------------\n";

// 파일에 내용 추가 (FILE_APPEND 플래그는 덮어쓰지 않고 이어붙이는 옵션)
file_put_contents($file, $data_to_save, FILE_APPEND | LOCK_EX);

// 성공 메시지 출력 (파이썬이 200 OK 응답을 받도록)
echo "제보가 성공적으로 저장되었습니다.";
?>
