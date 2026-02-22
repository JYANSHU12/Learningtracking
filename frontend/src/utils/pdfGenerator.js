export const generatePDFReport = (goals, sessions, analytics) => {
  const { subjectData } = analytics || { subjectData: [] };
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html><html><head>
    <title>Progress Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:40px;color:#1f2937}
      h1{color:#6366f1}
      .stats{display:flex;gap:16px;margin:20px 0}
      .stat{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;flex:1;text-align:center}
      .val{font-size:28px;font-weight:700;color:#6366f1}
      .lbl{font-size:13px;color:#9ca3af}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th{background:#f3f4f6;padding:10px 12px;text-align:left;font-size:13px}
      td{padding:8px 12px;border-bottom:1px solid #f3f4f6;font-size:13px}
      h2{margin-top:28px;font-size:17px;border-bottom:2px solid #e5e7eb;padding-bottom:8px}
      .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
      .active{background:#dbeafe;color:#1d4ed8}.completed{background:#dcfce7;color:#15803d}
    </style>
    </head><body>
    <h1>Learning Progress Report</h1>
    <p style="color:#9ca3af">Generated: ${new Date().toLocaleDateString('en-US',{dateStyle:'long'})}</p>
    <h2>Overview</h2>
    <div class="stats">
      <div class="stat"><div class="val">${Math.round(totalMinutes/60)}</div><div class="lbl">Hours Studied</div></div>
      <div class="stat"><div class="val">${goals.length}</div><div class="lbl">Total Goals</div></div>
      <div class="stat"><div class="val">${completedGoals}</div><div class="lbl">Completed</div></div>
      <div class="stat"><div class="val">${sessions.length}</div><div class="lbl">Sessions</div></div>
    </div>
    <h2>Goals</h2>
    <table>
      <tr><th>Title</th><th>Subject</th><th>Progress</th><th>Status</th><th>Target</th></tr>
      ${goals.map(g => `<tr><td>${g.title}</td><td>${g.subject}</td><td>${g.progress}%</td><td><span class="badge ${g.status}">${g.status}</span></td><td>${new Date(g.targetDate).toLocaleDateString()}</td></tr>`).join('')}
    </table>
    <h2>Subject Distribution</h2>
    <table>
      <tr><th>Subject</th><th>Time Spent</th></tr>
      ${subjectData.map(s => `<tr><td>${s._id}</td><td>${Math.round(s.totalMinutes/60*10)/10}h (${s.totalMinutes}min)</td></tr>`).join('')}
    </table>
    </body></html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
};
