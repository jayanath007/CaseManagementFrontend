param(
    [Parameter(Mandatory = $True)]
    [string]
    $resourceGroupName,

    [Parameter(Mandatory = $True)]
    [string]
    $webAppName
)
$xml = [xml] (Get-AzureRmWebAppPublishingProfile -Name $webAppName -OutputFile null -ResourceGroupName $resourceGroupName -Format Ftp)
$PublishProfile = $Xml.FirstChild.ChildNodes[1]
$rootUrl = $PublishProfile.publishUrl -replace "/wwwroot", "";
$userName = $PublishProfile.userName
$pw = $PublishProfile.userPWD
$webclient = New-Object -TypeName System.Net.WebClient
$webclient.Credentials = New-Object System.Net.NetworkCredential($username, $pw)
$uploadPath = "$($rootUrl)/applicationhost.xdt"
$webclient.UploadFile($uploadPath, "$($PSScriptRoot)\applicationhost.xdt")
